# Hacker gf

Hacker gf is a React/Vite developer workspace with AI chat, a code editor, file tools, usage views, and account settings. Existing app data/integrations use Base44; the custom AI chat endpoint verifies Supabase sessions and sends approved model requests to OpenRouter.

**Configured canonical domain:** https://hackergf.devs.surf

**Vercel alias:** https://hackergf-ai.vercel.app

## Quick start

Requirements: Node.js 20+ and npm.

    git clone https://github.com/itssourov13/hackergf-ai.git
    cd hackergf-ai
    npm ci
    cp .env.example .env.local
    npm run dev

Vite runs at http://localhost:5173. To test the custom API locally, open a second terminal and run:

    node server/server.js

The local API listens on port 5000, and Vite proxies /api requests to it. Configure the server-side variables below in .env.local before testing AI chat.

## Configuration

Start from .env.example. The main deployment variables are:

- **OPENROUTER_API_KEY** — required server-only key for AI responses.
- **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN** — both required in Vercel Production for shared rate limiting and the Free-plan monthly quota.
- **VITE_BASE44_APP_ID** — needed for Base44-backed features; obtain the real ID from the Base44 project settings.
- **PUBLIC_APP_URL** — optional; defaults to the canonical domain.
- **VITE_SUPABASE_URL**, **VITE_SUPABASE_ANON_KEY**, **SUPABASE_URL**, **SUPABASE_ANON_KEY** — optional overrides if moving away from the existing Supabase project.

Never put privileged values in VITE_* variables. Keep OpenRouter and Upstash credentials server-side; never use a Supabase service-role key as the anon/publishable key. See [HANDOFF.md](./docs/HANDOFF.md) for the environment matrix, auth settings, security behavior, and outstanding production work.

## Commands

    npm run dev       # Vite development server
    npm run build     # Production frontend build
    npm run preview   # Preview the built frontend
    npm run typecheck # TypeScript check for configured TS/TSX scope
    npm run lint      # ESLint
    npm test          # API and deployment-configuration tests
    npm run check     # Full local quality gate

## Architecture at a glance

- **Frontend:** React 18, Vite 6, React Router, Tailwind CSS, lazy-loaded application pages.
- **AI API:** api/chat.js verifies a Supabase Bearer session, restricts model IDs and prompt size, checks premium entitlements, applies request limits, and calls OpenRouter.
- **Production controls:** Vercel serves the SPA and API functions; Upstash provides cross-instance counters. api/healthz.js exposes a basic health endpoint.
- **Local API:** server/server.js reuses the same chat handler; Vite proxies /api to localhost:5000.
- **Existing services:** Base44 remains used for app data/integrations; Supabase Auth is used by the custom chat API.

## Deployment and handoff

Read [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for platform-specific deployment instructions and [HANDOFF.md](./docs/HANDOFF.md) before changing production configuration.

Important current limitations:
- Vercel AI chat fails closed until both Upstash REST variables and OPENROUTER_API_KEY are configured.
- Free users are limited to 50 AI messages per UTC calendar month plus 15 requests per user per minute when Upstash is enabled.
- Paid checkout/webhooks are not implemented. Billing upgrades are disabled, and premium models require trusted Supabase app_metadata claims written by a server-side billing/admin workflow.
- A previous production-only dependency audit passed. A full audit of development/build dependencies has known high-severity advisories in the Tailwind CSS v3 dependency chain; see docs/HANDOFF.md before attempting a major CSS migration.

## Project documents

- [HANDOFF.md](./docs/HANDOFF.md) — current implementation, deployment prerequisites, verification, known gaps, and next steps.
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) — deployment guide.
- [DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) — developer workflow and conventions.
- [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) — folder map.
- [PROJECT_DOCUMENTATION.md](./docs/PROJECT_DOCUMENTATION.md) — wider project reference.
- [.env.example](./.env.example) — variable names and safe placeholders only.
