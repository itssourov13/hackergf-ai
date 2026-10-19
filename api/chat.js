import {
  DEFAULT_SUPABASE_PUBLISHABLE_KEY,
  DEFAULT_SUPABASE_URL,
} from "../src/lib/supabaseConfig.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o-mini";
const PREMIUM_MODEL_ALIASES = new Set([
  "gpt_5_4",
  "gpt_5_5",
  "gemini_3_1_pro",
  "claude_sonnet_4_6",
  "claude_opus_4_6",
  "claude_opus_4_7",
  "claude_opus_4_8",
  "claude-sonnet-5",
]);
const PAID_PLANS = new Set(["pro", "team", "enterprise"]);
const VALID_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);
const MAX_PROMPT_LENGTH = 20_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;
const FREE_MONTHLY_MESSAGE_LIMIT = 50;
const UPSTASH_TIMEOUT_MS = 4_000;
const AUTH_TIMEOUT_MS = 8_000;
const UPSTREAM_TIMEOUT_MS = 45_000;

// Map UI aliases to validated OpenRouter IDs. Never allow arbitrary client-supplied models.
export const OPENROUTER_MODELS = Object.freeze({
  automatic: DEFAULT_MODEL,
  gpt_5_mini: "openai/gpt-5-mini",
  gpt_5_4: "openai/gpt-5.4",
  gpt_5_5: "openai/gpt-5.5",
  gemini_3_flash: "google/gemini-3-flash-preview",
  gemini_3_1_pro: "google/gemini-3.1-pro-preview",
  claude_sonnet_4_6: "anthropic/claude-sonnet-4.6",
  claude_opus_4_6: "anthropic/claude-opus-4.6",
  claude_opus_4_7: "anthropic/claude-opus-4.7",
  claude_opus_4_8: "anthropic/claude-opus-4.8",
  "claude-sonnet-5": "anthropic/claude-sonnet-5",
});

function json(res, status, body) {
  res.setHeader?.("Cache-Control", "no-store");
  return res.status(status).json(body);
}

function parseBody(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body && typeof body === "object" && !Array.isArray(body) ? body : null;
}

function readBearerToken(header) {
  if (typeof header !== "string") return null;
  const match = header.match(/^Bearer\s+([^\s]+)$/i);
  return match?.[1] ?? null;
}

async function runUpstashPipeline({ url, token, fetchImpl, commands }) {
  const response = await fetchImpl((url.endsWith("/") ? url.slice(0, -1) : url) + "/pipeline", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(UPSTASH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error("Upstash returned HTTP " + response.status);

  const results = await response.json();
  if (!Array.isArray(results) || results.some((item) => item?.error)) {
    throw new Error("Upstash returned an invalid pipeline response");
  }
  return results.map((item) => item?.result);
}

export function createChatHandler({
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = Date.now,
  rateLimitMax = RATE_LIMIT_MAX,
  rateLimitWindowMs = RATE_LIMIT_WINDOW_MS,
} = {}) {
  const rateBuckets = new Map();

  return async function chatHandler(req, res) {
    if (req.method !== "POST") {
      res.setHeader?.("Allow", "POST");
      return json(res, 405, { error: "Method not allowed" });
    }

    const openRouterKey = env.OPENROUTER_API_KEY?.trim();
    if (!openRouterKey) {
      return json(res, 503, { error: "AI service is not configured yet." });
    }

    const body = parseBody(req.body);
    if (!body) return json(res, 400, { error: "A valid JSON request body is required." });

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) return json(res, 400, { error: "A prompt is required." });
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return json(res, 413, { error: `Prompt exceeds the ${MAX_PROMPT_LENGTH.toLocaleString()} character limit.` });
    }

    const requestedModel = body.model == null || body.model === "" ? "automatic" : body.model;
    if (typeof requestedModel !== "string" || !Object.hasOwn(OPENROUTER_MODELS, requestedModel)) {
      return json(res, 400, { error: "The selected AI model is not supported." });
    }

    const accessToken = readBearerToken(req.headers?.authorization ?? req.headers?.Authorization);
    if (!accessToken) return json(res, 401, { error: "Please sign in to use AI chat." });

    // Server-only names are preferred; fallbacks preserve the existing public Supabase project.
    const supabaseUrl = (env.SUPABASE_URL || env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim().replace(/\/$/, "");
    const supabaseKey = (env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY).trim();

    let authResponse;
    try {
      authResponse = await fetchImpl(`${supabaseUrl}/auth/v1/user`, {
        method: "GET",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
      });
    } catch (error) {
      console.error("Supabase session verification request failed", { name: error?.name });
      return json(res, 503, { error: "Authentication service is temporarily unavailable." });
    }

    if (authResponse.status === 401 || authResponse.status === 403) {
      return json(res, 401, { error: "Your session is invalid or has expired. Please sign in again." });
    }
    if (!authResponse.ok) {
      console.error("Supabase session verification failed", { status: authResponse.status });
      return json(res, 503, { error: "Authentication service is temporarily unavailable." });
    }

    let user;
    try {
      user = await authResponse.json();
    } catch {
      return json(res, 503, { error: "Authentication service returned an invalid response." });
    }
    if (typeof user?.id !== "string" || !user.id) {
      return json(res, 401, { error: "Your session is invalid or has expired. Please sign in again." });
    }

    // Never trust a plan sent in the request body or user-editable user_metadata.
    // Paid entitlements must be written to server-managed Supabase app_metadata by a trusted
    // billing/admin integration. Until then, premium models fail closed.
    const appMetadata = user.app_metadata && typeof user.app_metadata === "object"
      ? user.app_metadata
      : {};
    const plan = typeof appMetadata.plan === "string" ? appMetadata.plan.toLowerCase() : "free";
    const subscriptionStatus = typeof appMetadata.subscription_status === "string"
      ? appMetadata.subscription_status.toLowerCase()
      : "";
    const hasPremiumAccess = appMetadata.role === "admin" || (
      PAID_PLANS.has(plan) && VALID_SUBSCRIPTION_STATUSES.has(subscriptionStatus)
    );
    if (PREMIUM_MODEL_ALIASES.has(requestedModel) && !hasPremiumAccess) {
      return json(res, 403, {
        error: "This AI model requires an active Pro, Team, or Enterprise subscription.",
        code: "PREMIUM_MODEL_REQUIRES_SUBSCRIPTION",
      });
    }

    const time = now();
    const upstashUrl = env.UPSTASH_REDIS_REST_URL?.trim();
    const upstashToken = env.UPSTASH_REDIS_REST_TOKEN?.trim();
    if (Boolean(upstashUrl) !== Boolean(upstashToken)) {
      return json(res, 503, { error: "Rate limiting is misconfigured. Contact the site administrator." });
    }
    if ((env.NODE_ENV === "production" || env.VERCEL === "1") && !upstashUrl) {
      return json(res, 503, { error: "Shared AI rate limiting is not configured yet." });
    }

    if (upstashUrl && upstashToken) {
      // Shared rate limits and monthly Free-plan quotas across Vercel instances.
      const minuteBucket = Math.floor(time / rateLimitWindowMs);
      const rateKey = "hackergf:chat:rate:" + user.id + ":" + minuteBucket;
      let rateCount;
      try {
        [rateCount] = await runUpstashPipeline({
          url: upstashUrl,
          token: upstashToken,
          fetchImpl,
          commands: [
            ["INCR", rateKey],
            ["EXPIRE", rateKey, Math.ceil((rateLimitWindowMs * 2) / 1000)],
          ],
        });
      } catch (error) {
        console.error("Distributed rate-limit check failed", { name: error?.name });
        return json(res, 503, { error: "AI request protection is temporarily unavailable." });
      }

      if (!Number.isFinite(Number(rateCount))) {
        return json(res, 503, { error: "AI request protection returned an invalid response." });
      }
      if (Number(rateCount) > rateLimitMax) {
        res.setHeader?.("Retry-After", String(Math.max(1, Math.ceil((((minuteBucket + 1) * rateLimitWindowMs) - time) / 1000))));
        return json(res, 429, { error: "Too many AI requests. Please wait a minute and try again." });
      }

      if (!hasPremiumAccess) {
        const currentMonth = new Date(time).toISOString().slice(0, 7);
        const monthlyKey = "hackergf:chat:monthly:" + user.id + ":" + currentMonth;
        let monthlyCount;
        try {
          [monthlyCount] = await runUpstashPipeline({
            url: upstashUrl,
            token: upstashToken,
            fetchImpl,
            commands: [
              ["INCR", monthlyKey],
              ["EXPIRE", monthlyKey, 40 * 24 * 60 * 60],
            ],
          });
        } catch (error) {
          console.error("Monthly quota check failed", { name: error?.name });
          return json(res, 503, { error: "AI usage protection is temporarily unavailable." });
        }

        if (!Number.isFinite(Number(monthlyCount))) {
          return json(res, 503, { error: "AI usage protection returned an invalid response." });
        }
        if (Number(monthlyCount) > FREE_MONTHLY_MESSAGE_LIMIT) {
          // Undo the rejected reservation so repeated over-quota requests do not grow the key unbounded.
          // The request still fails closed if this best-effort decrement is unavailable.
          try {
            await runUpstashPipeline({
              url: upstashUrl,
              token: upstashToken,
              fetchImpl,
              commands: [["DECR", monthlyKey]],
            });
          } catch (error) {
            console.error("Monthly quota reservation release failed", { name: error?.name });
          }
          return json(res, 429, {
            error: "The Free plan includes 50 AI messages per calendar month. Upgrade to continue.",
            code: "MONTHLY_QUOTA_EXCEEDED",
          });
        }
      }
    } else {
      // Local/dev fallback only: in-memory limits are not shared between serverless instances.
      const bucket = rateBuckets.get(user.id);
      if (bucket && time - bucket.startedAt < rateLimitWindowMs) {
        if (bucket.count >= rateLimitMax) {
          res.setHeader?.("Retry-After", String(Math.max(1, Math.ceil((rateLimitWindowMs - (time - bucket.startedAt)) / 1000))));
          return json(res, 429, { error: "Too many AI requests. Please wait a minute and try again." });
        }
        bucket.count += 1;
      } else {
        rateBuckets.set(user.id, { startedAt: time, count: 1 });
      }

      if (rateBuckets.size > 1_000) {
        for (const [userId, entry] of rateBuckets) {
          if (time - entry.startedAt >= rateLimitWindowMs) rateBuckets.delete(userId);
        }
      }
    }

    const publicAppUrl = (env.PUBLIC_APP_URL || "https://hackergf.devs.surf").trim().replace(/\/$/, "");
    let upstreamResponse;
    try {
      upstreamResponse = await fetchImpl(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterKey}`,
          "HTTP-Referer": publicAppUrl,
          "X-Title": "Hacker gf",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODELS[requestedModel],
          messages: [{ role: "user", content: prompt }],
        }),
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
    } catch (error) {
      const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
      console.error("OpenRouter request failed", { name: error?.name, timedOut });
      return json(res, timedOut ? 504 : 502, {
        error: timedOut ? "The AI response timed out. Please try again." : "The AI service is temporarily unavailable.",
      });
    }

    let payload;
    try {
      payload = await upstreamResponse.json();
    } catch {
      payload = null;
    }

    if (!upstreamResponse.ok) {
      console.error("OpenRouter returned an error", {
        status: upstreamResponse.status,
        requestId: upstreamResponse.headers?.get?.("x-request-id") || undefined,
      });
      return json(res, upstreamResponse.status === 429 ? 429 : 502, {
        error: upstreamResponse.status === 429
          ? "The AI provider is rate limiting requests. Please try again shortly."
          : "The AI provider could not complete this request. Please try again later.",
      });
    }

    const message = payload?.choices?.[0]?.message?.content;
    if (typeof message !== "string" || !message.trim()) {
      console.error("OpenRouter returned no text content", { requestId: upstreamResponse.headers?.get?.("x-request-id") || undefined });
      return json(res, 502, { error: "The AI provider returned an empty response. Please try again." });
    }

    return json(res, 200, { message });
  };
}

const handler = createChatHandler();
export default handler;
