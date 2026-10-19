# Hacker gf — Engineering Handoff

**Last reviewed:** 2026-10-19
**Repository:** https://github.com/itssourov13/hackergf-ai
**Canonical domain configured in code:** https://hackergf.devs.surf
**Alternate Vercel domain:** https://hackergf-ai.vercel.app

This document is the operational handoff for whoever continues development or deployment. It describes the repository state and known dependencies; it does not claim that a new production deployment or external dashboard configuration has been verified.

## 1. Current repository baseline

- The production-readiness implementation was committed as **832f8d6** on **fix/production-readiness-domain-env** and pushed to origin.
- Documentation refresh is being prepared separately on **docs/readme-handoff-refresh**.
- The readiness changes hardened the chat API, added password-reset routes and health checks, configured SPA routing/security headers, updated domain metadata, and added API/configuration tests.
- No external Vercel or Supabase dashboard changes are included in Git. A successful push alone does not prove that the deployment has completed or that production secrets are present.

Check the actual working branch and deployment commit before proceeding. Do not assume the current live site runs the latest pushed commit until its deployment is verified.

## 2. Architecture

### Frontend and routing

- React 18 + Vite 6 single-page application.
- Route composition is in src/App.jsx; application pages live in src/pages and are lazy-loaded where appropriate.
- Vercel’s vercel.json rewrites browser routes to index.html and adds response security headers.
- Build output is dist/. The Vite development server runs on port 5173 by default.

### Services and API

- Base44 SDK remains part of the existing app for supported data and integration flows. Base44-backed features need the correct VITE_BASE44_APP_ID.
- Supabase Auth is used to persist browser sessions and to verify the Bearer token on the custom AI endpoint.
- api/chat.js is the shared handler for Vercel and the local Express server.
- api/healthz.js provides a minimal GET health check.
- server/server.js runs the local API on port 5000; vite.config.js proxies /api requests from Vite to that server.
- OpenRouter provides model responses. Model aliases are allowlisted in api/chat.js; do not let clients pass arbitrary provider model IDs.

## 3. Production environment

Configure these in **Vercel → Project → Settings → Environment Variables**, for the correct deployment environments. Redeploy after changing build-time VITE_* values.

| Variable | Required? | Purpose / notes |
|---|---|---|
| OPENROUTER_API_KEY | Required for AI chat | Server-only provider credential. Do not prefix with VITE_. |
| UPSTASH_REDIS_REST_URL | Required in Vercel Production | Upstash REST endpoint for distributed limits/quotas. |
| UPSTASH_REDIS_REST_TOKEN | Required in Vercel Production | Server-only Upstash REST bearer token. |
| VITE_BASE44_APP_ID | Required for Base44-backed features | Obtain the actual app ID from Base44; do not guess it. |
| VITE_BASE44_FUNCTIONS_VERSION | Optional | Base44 functions-version override if the app requires one. |
| VITE_BASE44_APP_BASE_URL | Optional | Base44 app URL override. |
| PUBLIC_APP_URL | Optional | OpenRouter attribution URL; default is the canonical domain. |
| VITE_SUPABASE_URL | Optional override | Browser-side Supabase project URL. |
| VITE_SUPABASE_ANON_KEY | Optional override | Public Supabase anon/publishable key for browser use. |
| SUPABASE_URL | Optional server override | Supabase URL used by server-side session verification. |
| SUPABASE_ANON_KEY | Optional server override | Public anon/publishable key used during token verification; never a service-role key. |

The repository currently has a fallback for an existing Supabase project in src/lib/supabaseConfig.js. Supabase overrides can be omitted only while that project is intended to remain in use. The fallback publishable key is public configuration, not a privileged service credential. Protect all data with correct Supabase Row Level Security policies.

In Vercel Production, the API returns a service-unavailable response when Upstash is missing or incorrectly configured. This is intentional fail-closed behavior; do not “fix” it by enabling in-memory rate limiting in serverless production.

### Supabase Auth URLs

In Supabase Dashboard → Authentication → URL Configuration:

- Set Site URL to https://hackergf.devs.surf.
- Add https://hackergf.devs.surf/** to Redirect URLs.
- Add https://hackergf-ai.vercel.app/** if users will also sign in through the Vercel alias.
- Add http://localhost:5173/** only for local development.

These are dashboard settings, not repository changes. Verify login, registration, email confirmation (if enabled), password reset, and reset completion from each domain users are expected to use.

## 4. AI API security and behavior

The custom chat endpoint currently implements:

- POST-only handling; other methods receive 405.
- JSON/body validation and a 20,000-character prompt limit.
- A fixed UI-alias-to-OpenRouter model allowlist.
- Supabase session verification before a model call.
- Premium authorization from server-managed Supabase user.app_metadata, not request fields or user-editable user_metadata.
- With Upstash configured: up to 15 requests per user per 60-second bucket and a Free-plan limit of 50 messages per UTC calendar month.
- Timeouts and generic upstream error messages, with sensitive provider responses not relayed to the browser.
- Fail-closed behavior if production rate-limit/quota dependencies are unavailable.

The local fallback rate limiter is in-memory and is not shared across processes or instances. It is only appropriate for local development/testing.

### Premium models and billing integration

Premium access currently requires trusted app_metadata claims: an active/trialing Pro, Team, or Enterprise plan, or an admin role. Those claims must be written by a trusted server-side admin/billing workflow.

Paid checkout and payment webhooks have **not** been implemented. Billing upgrade buttons are intentionally disabled; a browser must never be allowed to mark a subscription active by writing an ordinary database record or user-editable metadata. Base44 subscription records do not automatically sync to Supabase app_metadata. Do not unlock paid models until a verified integration has been designed, implemented, tested, and deployed.

Before public launch, configure provider-side spending limits and alerting for the OpenRouter account.

## 5. Local development and verification

Use Node.js 20+ and npm. From the repository root:

    npm ci
    cp .env.example .env.local
    npm run dev

To exercise /api routes locally, run the API server in a separate terminal:

    node server/server.js

The server loads .env.local by default, listens on port 5000, and is reached via Vite’s /api proxy.

Quality-gate commands:

    npm run typecheck
    npm run lint
    npm test
    npm run build
    npm run check

npm run check runs the configured TypeScript check, ESLint, Node tests, API/server syntax checks, a production/runtime dependency audit, and the Vite production build. The TypeScript check is scoped to the TS/TSX files selected by jsconfig.json; it is not a complete type-check of every legacy JSX file.

The production-readiness baseline was previously verified with all 19 Node tests passing, a successful build, and zero high-severity findings in npm audit --omit=dev --audit-level=high. Repeat npm run check after documentation or code changes as appropriate; this handoff is not a substitute for CI results on the latest commit.

### Dependency audit note

The production/runtime audit excludes development dependencies and passed on the previous implementation baseline. The full audit also reported five high-severity development/build-chain advisories associated with the existing Tailwind CSS v3 dependency chain (including transitive packages). A remediation path appeared to require a Tailwind CSS v4 migration. Do not force a major CSS/tooling upgrade as an incidental fix: plan it separately, review the migration guide, and run visual, responsive, lint, test, and production-build regression checks.

## 6. Deployment checklist

Before treating a push as production-ready:

1. Confirm the intended commit is on the deployment branch and GitHub/Vercel reports a successful deployment.
2. Confirm required Vercel environment variables exist in Production; check names and presence without printing secret values.
3. Confirm Supabase Site URL and Redirect URLs match the domains in use.
4. Open the canonical domain and directly refresh /login, /register, /forgot-password, /reset-password, /dashboard, /chat, and /billing. Public pages should render; protected routes should lead to login if unauthenticated.
5. Request GET /api/healthz and expect HTTP 200 with a small status response. Non-GET should return 405.
6. Test valid and invalid login, password-reset email, and the complete reset flow with a real test account.
7. Test /api/chat signed out (should be rejected), signed in with a supported Free model, with an invalid model, and past the configured request/quota limits. Verify a missing API key or Upstash setup fails closed without leaking secrets.
8. Verify the actual Base44 app ID and any data-dependent features using a test account.
9. Review Vercel function logs and provider usage/spend limits. Test on a mobile browser as well as desktop.
10. Confirm the deployed commit and domain before announcing release.

Do not paste API keys, auth tokens, service-role keys, or full environment dumps into issues, chat, or Git.

## 7. Known gaps and next work

### Must do before public AI traffic
- Add OPENROUTER_API_KEY and both Upstash REST variables to Vercel Production.
- Verify Base44’s real app ID and configure it for every environment that needs Base44 features.
- Verify Supabase auth redirect configuration on the canonical domain and alias.
- Smoke-test authenticated AI requests against the deployed environment.

### Required before selling paid subscriptions
- Implement a trusted checkout and webhook flow (including signature verification, idempotency, cancellation/refund handling, and plan changes).
- Write verified entitlements to Supabase app_metadata from a trusted server-side process.
- Test webhook failure/replay handling and premium authorization; keep paid checkout/model access disabled until this is complete.

### Follow-up engineering
- Plan remediation for the development dependency advisories separately from feature work, likely including a Tailwind v4 migration assessment.
- Add a production end-to-end deployment smoke test if CI/deployment credentials and a safe test account are available.
- Keep this document updated when deployment domains, environment variables, API controls, billing behavior, or verification results change.

## 8. Useful file map

| Path | Responsibility |
|---|---|
| src/App.jsx | Routes and application composition |
| src/lib/supabase.js | Browser Supabase client/session configuration |
| src/lib/supabaseConfig.js | Existing public Supabase project fallback values |
| src/pages/Login.jsx | Login UI and auth flow |
| src/pages/ForgotPassword.jsx | Request password-reset email |
| src/pages/ResetPassword.jsx | Set a new password using the reset session |
| src/pages/ChatPage.jsx | Chat UI, session token header, model selection |
| src/pages/BillingPage.jsx | Plan display; checkout intentionally disabled |
| api/chat.js | Authenticated, rate-limited OpenRouter API handler |
| api/healthz.js | Health endpoint |
| server/server.js | Local Express API server |
| vercel.json | SPA rewrites, function limits, response headers |
| .env.example | Safe environment-variable template |
| docs/DEPLOYMENT.md | Platform-specific deployment guide |
