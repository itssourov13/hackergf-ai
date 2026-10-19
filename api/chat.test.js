import test from "node:test";
import assert from "node:assert/strict";
import { createChatHandler, OPENROUTER_MODELS } from "./chat.js";

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    json(body) { this.body = body; return this; },
  };
}

function req({ method = "POST", body = { prompt: "hello" }, authorization = "Bearer valid-access-token" } = {}) {
  return { method, body, headers: authorization ? { authorization } : {} };
}

function response(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json", "x-request-id": "test-request" },
  });
}

const configuredEnv = {
  OPENROUTER_API_KEY: "test-openrouter-key",
  SUPABASE_URL: "https://supabase.test",
  SUPABASE_ANON_KEY: "test-publishable-key",
};

function validFetch(calls = [], authUser = { id: "user-123" }) {
  return async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith("/auth/v1/user")) return response(authUser);
    if (String(url) === "https://openrouter.ai/api/v1/chat/completions") {
      return response({ choices: [{ message: { content: "Hello from Zoya" } }] });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };
}

test("rejects methods other than POST and advertises Allow: POST", async () => {
  const handler = createChatHandler({ env: configuredEnv });
  const res = createResponse();
  await handler(req({ method: "GET" }), res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, "POST");
});

test("fails closed when the OpenRouter key is missing", async () => {
  const handler = createChatHandler({ env: { ...configuredEnv, OPENROUTER_API_KEY: "" } });
  const res = createResponse();
  await handler(req(), res);
  assert.equal(res.statusCode, 503);
  assert.match(res.body.error, /not configured/i);
});

test("requires a bearer session and rejects arbitrary model IDs", async () => {
  const handler = createChatHandler({ env: configuredEnv, fetchImpl: validFetch() });
  const noToken = createResponse();
  await handler(req({ authorization: null }), noToken);
  assert.equal(noToken.statusCode, 401);

  const badModel = createResponse();
  await handler(req({ body: { prompt: "hello", model: "some/provider-secret-model" } }), badModel);
  assert.equal(badModel.statusCode, 400);
  assert.match(badModel.body.error, /model/i);
});

test("validates prompt size before making outbound API requests", async () => {
  let calls = 0;
  const handler = createChatHandler({ env: configuredEnv, fetchImpl: async () => { calls += 1; return response({ id: "user-123" }); } });
  const res = createResponse();
  await handler(req({ body: { prompt: "x".repeat(20_001) } }), res);
  assert.equal(res.statusCode, 413);
  assert.equal(calls, 0);
});

test("verifies Supabase session, maps model aliases, and returns the AI response", async () => {
  const calls = [];
  const handler = createChatHandler({ env: configuredEnv, fetchImpl: validFetch(calls) });
  const res = createResponse();
  await handler(req({ body: { prompt: "  Explain Vite.  ", model: "gpt_5_mini" } }), res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { message: "Hello from Zoya" });
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://supabase.test/auth/v1/user");
  assert.equal(calls[0].options.headers.Authorization, "Bearer valid-access-token");
  assert.equal(calls[1].options.headers.Authorization, "Bearer test-openrouter-key");
  assert.equal(calls[1].options.headers["HTTP-Referer"], "https://hackergf.devs.surf");
  assert.equal(JSON.parse(calls[1].options.body).model, "openai/gpt-5-mini");
  assert.equal(JSON.parse(calls[1].options.body).messages[0].content, "Explain Vite.");
});

test("denies premium models unless a trusted active subscription claim exists", async () => {
  let calls = [];
  const freeHandler = createChatHandler({
    env: configuredEnv,
    fetchImpl: validFetch(calls, { id: "user-free", user_metadata: { plan: "enterprise" } }),
  });
  const denied = createResponse();
  await freeHandler(req({ body: { prompt: "hello", model: "claude_opus_4_8" } }), denied);
  assert.equal(denied.statusCode, 403);
  assert.equal(denied.body.code, "PREMIUM_MODEL_REQUIRES_SUBSCRIPTION");
  assert.equal(calls.length, 1); // Auth was checked; OpenRouter was not called.

  calls = [];
  const proHandler = createChatHandler({
    env: configuredEnv,
    fetchImpl: validFetch(calls, { id: "user-pro", app_metadata: { plan: "pro", subscription_status: "active" } }),
  });
  const allowed = createResponse();
  await proHandler(req({ body: { prompt: "hello", model: "claude_opus_4_8" } }), allowed);
  assert.equal(allowed.statusCode, 200);
  assert.equal(JSON.parse(calls[1].options.body).model, "anthropic/claude-opus-4.8");
});

test("rejects an expired Supabase session and never calls OpenRouter", async () => {
  let fetchCalls = 0;
  const handler = createChatHandler({
    env: configuredEnv,
    fetchImpl: async () => { fetchCalls += 1; return response({ message: "no" }, 401); },
  });
  const res = createResponse();
  await handler(req(), res);
  assert.equal(res.statusCode, 401);
  assert.equal(fetchCalls, 1); // Only the Supabase auth verification ran; OpenRouter was not called.
});

test("enforces a per-user burst limit in a warm function instance", async () => {
  let current = 100_000;
  const handler = createChatHandler({ env: configuredEnv, fetchImpl: validFetch(), now: () => current, rateLimitMax: 1 });
  const first = createResponse();
  await handler(req(), first);
  assert.equal(first.statusCode, 200);
  const second = createResponse();
  await handler(req(), second);
  assert.equal(second.statusCode, 429);
  assert.ok(Number(second.headers["retry-after"]) > 0);
  current += 60_001;
  const third = createResponse();
  await handler(req(), third);
  assert.equal(third.statusCode, 200);
});

test("fails closed in production when the shared limiter is not configured", async () => {
  const calls = [];
  const handler = createChatHandler({
    env: { ...configuredEnv, NODE_ENV: "production" },
    fetchImpl: validFetch(calls),
  });
  const res = createResponse();
  await handler(req(), res);
  assert.equal(res.statusCode, 503);
  assert.match(res.body.error, /rate limiting/i);
  assert.equal(calls.length, 1); // Authentication ran; neither limiter nor OpenRouter was called.
});

test("detects Vercel runtime even if NODE_ENV is not populated", async () => {
  const calls = [];
  const handler = createChatHandler({
    env: { ...configuredEnv, VERCEL: "1" },
    fetchImpl: validFetch(calls),
  });
  const res = createResponse();
  await handler(req(), res);
  assert.equal(res.statusCode, 503);
  assert.match(res.body.error, /rate limiting/i);
  assert.equal(calls.length, 1);
});

test("enforces distributed rate limits and monthly Free-plan quotas through Upstash", async () => {
  const calls = [];
  const env = {
    ...configuredEnv,
    NODE_ENV: "production",
    UPSTASH_REDIS_REST_URL: "https://redis.example",
    UPSTASH_REDIS_REST_TOKEN: "test-redis-token",
  };
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).endsWith("/auth/v1/user")) return response({ id: "free-user", app_metadata: {} });
    if (String(url).endsWith("/pipeline")) {
      const commands = JSON.parse(options.body);
      if (commands[0][0] === "DECR") return response([{ result: 50 }]);
      const isMonthly = String(commands[0][1]).includes(":monthly:");
      return response([{ result: isMonthly ? 51 : 1 }, { result: 1 }]);
    }
    if (String(url) === "https://openrouter.ai/api/v1/chat/completions") {
      return response({ choices: [{ message: { content: "Should not reach upstream" } }] });
    }
    throw new Error("Unexpected URL");
  };

  const handler = createChatHandler({ env, fetchImpl });
  const res = createResponse();
  await handler(req(), res);
  assert.equal(res.statusCode, 429);
  assert.equal(res.body.code, "MONTHLY_QUOTA_EXCEEDED");
  assert.equal(calls.filter((call) => call.url === "https://openrouter.ai/api/v1/chat/completions").length, 0);
  assert.equal(calls.filter((call) => call.url.endsWith("/pipeline")).length, 3);
  assert.deepEqual(
    JSON.parse(calls.filter((call) => call.url.endsWith("/pipeline"))[2].options.body),
    [["DECR", JSON.parse(calls.filter((call) => call.url.endsWith("/pipeline"))[1].options.body)[0][1]]],
  );
});

test("blocks requests when only half of the Upstash configuration is present", async () => {
  const calls = [];
  const handler = createChatHandler({
    env: { ...configuredEnv, UPSTASH_REDIS_REST_URL: "https://redis.example" },
    fetchImpl: validFetch(calls),
  });
  const res = createResponse();
  await handler(req(), res);
  assert.equal(res.statusCode, 503);
  assert.match(res.body.error, /misconfigured/i);
  assert.equal(calls.length, 1);
});

test("keeps the UI model catalogue aliases mapped to actual OpenRouter IDs", () => {
  assert.equal(OPENROUTER_MODELS.automatic, "openai/gpt-4o-mini");
  assert.equal(OPENROUTER_MODELS["claude-sonnet-5"], "anthropic/claude-sonnet-5");
  assert.ok(Object.keys(OPENROUTER_MODELS).length >= 10);
});
