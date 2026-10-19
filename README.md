# Hacker gf — AI-Powered Development Platform

A production-ready AI SaaS platform for developers. Chat with AI, write code, execute programs, and manage files — all in one hacker-themed interface built on the Base44 platform.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Build](#build)
- [Preview](#preview)
- [Deployment](#deployment)
- [Base44 Development Workflow](#base44-development-workflow)
- [How to Download / Eject from Base44](#how-to-download--eject-from-base44)
- [How to Continue Development Locally](#how-to-continue-development-locally)
- [Git Workflow](#git-workflow)
- [How to Deploy After Ejecting from Base44](#how-to-deploy-after-ejecting-from-base44)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Security Notes](#security-notes)
- [License](#license)
- [Credits](#credits)

---

## Overview

**Hacker gf** is an all-in-one AI-powered development environment that streamlines coding, document processing, and terminal automation for professional software engineering teams. The AI assistant is named **Zoya** — an elite AI coding assistant embedded directly in the developer platform.

The application is built on the **Base44** Backend-as-a-Service platform, which provides authentication, database, AI model integrations, file storage, and analytics out of the box.

---

## Features

### AI Chat System
- Real-time AI chat with streaming-style loading and thinking indicators
- Multi-provider model support: GPT-5 Mini/4/5, Gemini 3 Flash/3.1 Pro, Claude Sonnet 4.6, Claude Opus 4.6–4.8, Claude Sonnet 5
- Conversation sidebar with create, delete, pin, and switch
- Markdown rendering with syntax-highlighted code blocks
- Copy message, regenerate response, and model selector with premium badges
- Suggested prompts for empty state
- Auto-scroll and animated typing indicator

### Code Editor
- Multi-tab code editor with file management (create, rename, delete)
- Unsaved changes indicator
- Save to database via Base44 entities
- Language support: JavaScript, TypeScript, Python, HTML, CSS, JSON, Markdown, Bash
- Integrated terminal with browser-sandboxed JavaScript execution
- Dark hacker theme with configurable font size, word wrap, and minimap

### File Upload & Document Processing
- Drag & drop upload with file picker
- File type validation and per-type size limits
- Content extraction for PDF, DOCX, TXT, Markdown, JSON, CSV, and source code files
- File manager with search, preview, and metadata (word count, character count, page count)

### Billing & Subscription
- Four subscription tiers: Free, Pro, Team, Enterprise
- Monthly and yearly billing cycles
- Usage tracking for AI messages, tokens, storage, file uploads, code executions, and API requests
- Plan-based feature flag system with admin override

### Administration
- Admin-only dashboard with system statistics, user management, and feature flag controls
- Security log for tracking user actions and system events
- API key management with permissions and expiration
- Support ticket system

### Additional Pages
- **Dashboard** — Central hub with stats and quick actions
- **Usage Analytics** — Charts and metrics visualizations (Recharts)
- **Usage Quotas & Reports** — Plan-based quota tracking
- **Model Comparison** — AI model specifications and capabilities
- **API Keys** — Key generation and management
- **Projects** — Code project management
- **Code Snippets** — Reusable code snippet library with favorites and tags
- **Settings** — AI preferences, editor configuration, notifications
- **Zoya Persona Settings** — AI tone, interaction style, response length, system prompt
- **User Profile** — Account details and preferences
- **Support Center** — Support ticket submission
- **Documentation** — In-app help guides
- **System Status** — Service health and incident history
- **Roadmap** — Product roadmap visualization
- **Feedback Portal** — Feature requests and bug reports with voting
- **Security Log** — Audit trail of security events
- **Quick Commands** — Command reference
- **Keyboard Shortcuts** — Shortcut reference
- **Status Page** — Real-time service status

### UI / UX
- Dark hacker aesthetic with red accent color
- Fully responsive (mobile-first design)
- Smooth scrolling and fade-in animations
- Glassmorphism chat interface with Framer Motion animations
- Sectioned sidebar navigation
- Accessible focus states, reduced-motion support, and keyboard navigation
- SEO-optimized with structured data, Open Graph, and Twitter Cards

---

## Tech Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 3 + shadcn/ui (New York style, neutral base) |
| **Routing** | React Router DOM 6 |
| **State / Data Fetching** | TanStack React Query 5 |
| **Animations** | Framer Motion 11 |
| **Icons** | Lucide React |
| **Charts** | Recharts 2 |
| **Markdown** | React Markdown 9 |
| **Forms** | React Hook Form 7 + Zod |
| **Backend-as-a-Service** | Base44 SDK (`@base44/sdk`) |
| **Vite Plugin** | `@base44/vite-plugin` |
| **3D Graphics** | Three.js |
| **Maps** | React Leaflet |
| **Drag & Drop** | @hello-pangea/dnd |
| **Date Handling** | date-fns, moment |
| **Type Checking** | TypeScript (jsconfig.json with checkJs) |
| **Linting** | ESLint 9 with React, React Hooks, and Unused Imports plugins |
| **CSS Processing** | PostCSS + Autoprefixer |
| **Stripe** | @stripe/react-stripe-js, @stripe/stripe-js |

---

## Folder Structure

```
hacker-gf/
├── base44/
│   ├── config.jsonc              # Base44 site configuration
│   └── entities/                 # Database entity schemas (JSON)
├── public/                       # Static assets
├── src/
│   ├── api/
│   │   └── base44Client.js       # Pre-initialized Base44 SDK client
│   ├── components/
│   │   ├── chat/                 # Chat-specific components
│   │   ├── feedback/             # Feedback components
│   │   ├── landing/              # Landing page sections
│   │   ├── snippets/             # Code snippet components
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── AppLayout.jsx         # Authenticated app layout with sidebar
│   │   ├── ErrorBoundary.jsx     # Global error boundary
│   │   ├── ProtectedRoute.jsx    # Route auth guard
│   │   └── RouteLoader.jsx       # Suspense fallback loader
│   ├── hooks/                    # Custom React hooks
│   ├── lib/
│   │   ├── config/               # Centralized configuration
│   │   ├── AuthContext.jsx       # Authentication context provider
│   │   ├── app-params.js         # App parameter extraction
│   │   ├── PageNotFound.jsx      # 404 page
│   │   ├── query-client.js       # React Query client
│   │   ├── usage.js              # Usage tracking utilities
│   │   └── utils.js              # Shared utility functions
│   ├── pages/                    # Application pages (25+)
│   ├── utils/
│   │   └── index.ts              # Shared utilities
│   ├── App.jsx                   # Router and app composition
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles & design tokens
├── index.html                    # HTML entry with SEO meta tags
├── package.json                  # Dependencies and scripts
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── jsconfig.json                 # TypeScript path aliases
├── eslint.config.js              # ESLint configuration
├── components.json               # shadcn/ui configuration
├── AGENTS.md                     # AI agent instructions
├── CLAUDE.md                     # Claude AI instructions
└── README.md                     # This file
```

> See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for a detailed folder-by-folder breakdown.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser (Client)                       │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  React App   │  │  React Router │  │  AuthContext       │  │
│  │  (App.jsx)   │  │  (6 routes)   │  │  (AuthProvider)    │  │
│  └──────┬───────┘  └──────┬───────┘  └─────────┬──────────┘  │
│         │                 │                     │              │
│  ┌──────┴─────────────────┴─────────────────────┴──────────┐  │
│  │              Base44 SDK Client (base44Client.js)        │  │
│  │         (entities, auth, integrations, analytics)       │  │
│  └──────────────────────────┬──────────────────────────────┘  │
└──────────────────────────────┼───────────────────────────────┘
                               │ HTTPS / API
┌──────────────────────────────┼───────────────────────────────┐
│                      Base44 Platform (BaaS)                    │
│                                                               │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │   Auth   │  │ Database │  │   AI     │  │   File      │  │
│  │ (JWT,    │  │ (Mongo)  │  │   LLM    │  │   Storage   │  │
│  │  OAuth)  │  │          │  │   APIs   │  │             │  │
│  └─────────┘  └──────────┘  └──────────┘  └─────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**
- **Base44 SDK** handles auth, database CRUD, AI invocations, file uploads, and analytics — no custom backend code required.
- **Lazy loading**: All authenticated pages are code-split via `React.lazy()` + `Suspense` for smaller initial bundles.
- **Centralized configuration**: Plans, roles, AI models, feature flags, upload limits, and app constants live in `src/lib/config/`.
- **Design tokens**: CSS custom properties in `src/index.css` mapped through `tailwind.config.js`.
- **Data isolation**: Entity queries are filtered by `created_by_id` for per-user data isolation.

---

## Prerequisites

- **Node.js** 18+ (recommended 20+)
- **npm** 10+ (or yarn / pnpm — examples use npm)
- A **Base44 account** with an app created (for hosted backend)
- A modern browser with JavaScript enabled

---

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd hacker-gf

# Install dependencies
npm install
```

---

## Environment Variables

The production canonical URL is `https://hackergf.devs.surf/`; `https://hackergf-ai.vercel.app/` remains an alternate Vercel alias. Both domains need to be allowed in Supabase Auth redirect settings if you intend to sign in from both.

Copy `.env.example` to `.env.local` for local development. On Vercel, configure the variables below under **Project → Settings → Environment Variables**. Redeploy after changing build-time variables.

| Variable | Purpose | Required |
|---|---|---|
| `VITE_BASE44_APP_ID` | Base44 application ID for Base44-backed data/integrations | Yes for Base44 features |
| `VITE_BASE44_FUNCTIONS_VERSION` | Optional Base44 functions version | No |
| `VITE_BASE44_APP_BASE_URL` | Optional Base44 app base URL | No |
| `VITE_SUPABASE_URL` | Public Supabase project URL override | Optional; current project fallback exists |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase publishable/anon key override | Optional; current project fallback exists |
| `SUPABASE_URL` | Server-side Supabase URL for chat session verification | Optional override |
| `SUPABASE_ANON_KEY` | Server-side Supabase publishable/anon key for session verification | Optional override; never use a service-role key here |
| `OPENROUTER_API_KEY` | Secret key used only by `/api/chat` | **Required for AI chat** |
| `PUBLIC_APP_URL` | URL sent to OpenRouter for attribution | Optional; defaults to the canonical domain |
| `UPSTASH_REDIS_REST_URL` | Upstash REST endpoint for shared rate limiting and Free monthly quota | Required in Vercel Production |
| `UPSTASH_REDIS_REST_TOKEN` | Server-only Upstash REST bearer token | Required in Vercel Production |

`VITE_*` variables are baked into the browser bundle and must never contain privileged secrets. `OPENROUTER_API_KEY` must not use a `VITE_` prefix. The Supabase publishable/anon key is designed for browser use; protect data with Supabase Row Level Security policies. Never place a Supabase `service_role` key in this repository or in a `VITE_*` variable.

### Supabase Auth redirect configuration

In Supabase Dashboard → Authentication → URL Configuration, set Site URL to https://hackergf.devs.surf. Add https://hackergf.devs.surf/** and (while keeping the Vercel alias) https://hackergf-ai.vercel.app/** to Redirect URLs. Use http://localhost:5173/** only for local development. These dashboard settings must be configured outside the repository.

The serverless chat endpoint verifies Supabase sessions, validates model IDs and prompt size, requires trusted Supabase app_metadata claims for premium models, and enforces a shared per-user rate limit plus the Free plan’s 50-message monthly quota through Upstash in Vercel Production. Set both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel Production or the AI endpoint fails closed. Local development without these values uses an in-memory burst limit only. Base44 subscriptions do not automatically sync to Supabase Auth metadata and this repo has no verified checkout/webhook; premium models therefore stay locked and paid plan changes are disabled until a trusted billing integration publishes those claims. Configure provider spending limits before significant public traffic.

Additionally, the app extracts runtime parameters from the URL and `localStorage` (see `src/lib/app-params.js`):
- `app_id` — Base44 app ID
- `access_token` — Auth token (removed from URL after extraction)
- `from_url` — Post-login redirect destination
- `functions_version` — Functions version override
- `app_base_url` — App base URL override

---

## Running Locally

### Option 1: Frontend-only (against hosted Base44 backend)

```bash
npm run dev
```

This starts the Vite dev server with hot module replacement (HMR). The app connects to the hosted Base44 backend.

### Option 2: Full local Base44 backend

```bash
base44 dev
```

This runs the Base44 CLI, which can start both the local backend and the frontend together. See the [Base44 CLI documentation](https://docs.base44.com/developers/references/cli/get-started/overview.md) for setup.

The dev server runs at `http://localhost:5173` by default.

---

## Build

```bash
# Type-check (optional)
npm run typecheck

# Lint (optional)
npm run lint

# Full local quality gate (typecheck + lint + API tests + production build)
npm run check

# Production build only
npm run build
```

The build outputs to `./dist` as configured in `base44/config.jsonc` (`outputDirectory: "./dist"`).

---

## Preview

```bash
# Preview the production build locally
npm run preview
```

This serves the `./dist` folder on a local server for testing before deployment.

---

## Deployment

### On Base44 Platform

The app is deployed via the Base44 platform. The `base44/config.jsonc` file defines:
- `installCommand`: `npm install`
- `buildCommand`: `npm run build`
- `serveCommand`: `npm run dev`
- `outputDirectory`: `./dist`

### After Ejecting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions for deploying to Vercel, Netlify, Cloudflare Pages, or a VPS with Nginx.

---

## Base44 Development Workflow

1. **Create an app** on the [Base44 platform](https://base44.com).
2. The platform generates the app ID and injects it at runtime.
3. Develop using the Base44 Builder (chat-based AI development) or locally with `npm run dev`.
4. Entities, auth, AI integrations, and file storage are managed by the Base44 SDK.
5. Changes made in the Builder are reflected in the codebase and vice versa.

### Key Base44 SDK Operations

```javascript
import { base44 } from '@/api/base44Client';

// Entity CRUD
base44.entities.Chat.list();
base44.entities.Chat.filter({ created_by_id: user.id }, '-created_date', 20);
base44.entities.Chat.create({ title: "New Chat" });
base44.entities.Chat.update(id, { title: "Updated" });
base44.entities.Chat.delete(id);

// AI Integration
base44.integrations.Core.InvokeLLM({ prompt: "Hello", model: "automatic" });

// File Upload
base44.integrations.Core.UploadFile({ file });

// Auth
base44.auth.me();
base44.auth.isAuthenticated();
base44.auth.logout();

// Analytics
base44.analytics.track({ eventName: "user_action", properties: {} });
```

---

## How to Download / Eject from Base44

To eject the project from the Base44 platform and run it entirely independently:

1. **Download the codebase**: Export your project from the Base44 Builder dashboard, or clone the repository if you have Git access.

2. **Review Base44 dependencies**: The project depends on:
   - `@base44/sdk` — The Base44 SDK client
   - `@base44/vite-plugin` — Vite plugin for Base44 integration

3. **Environment setup**: Create a `.env.local` file with your Base44 app ID:
   ```env
   VITE_BASE44_APP_ID=your_app_id
   ```

4. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```

5. **Full ejection** (optional): To completely remove Base44 dependencies, you would need to:
   - Replace `src/api/base44Client.js` with your own API client
   - Replace all `base44.entities.*` calls with your own backend API calls
   - Replace `base44.auth.*` with your own auth solution
   - Replace `base44.integrations.Core.*` with direct API calls to AI providers, file storage, etc.
   - Remove `@base44/sdk` and `@base44/vite-plugin` from `package.json`
   - Update `vite.config.js` to remove the Base44 plugin

   > **Warning**: Full ejection is a significant effort and requires replacing all backend functionality.

---

## How to Continue Development Locally

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd hacker-gf
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local  # If .env.example exists
   # Edit .env.local with your Base44 app ID
   ```

3. **Start the dev server**:
   ```bash
   npm run dev
   ```

4. **Make changes**: The Vite dev server provides instant HMR. Changes to any file in `src/` are reflected immediately.

5. **Code quality checks**:
   ```bash
   npm run lint       # Lint the code
   npm run typecheck  # Type-check with TypeScript
   npm run build      # Verify production build succeeds
   ```

---

## Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then stage
git add .

# Commit with a descriptive message
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

### Commit Message Convention

Follow conventional commits:
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (no logic changes)
- `refactor:` — Code refactoring
- `test:` — Test additions
- `chore:` — Build/tooling changes

---

## How to Deploy After Ejecting from Base44

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables in the Vercel dashboard: `VITE_BASE44_APP_ID` (Base44 feature dependency) and `OPENROUTER_API_KEY` (server-only; required for AI chat). See the Environment Variables table above for Supabase overrides.

### Other Platforms

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions for:
- Vercel
- Netlify
- Cloudflare Pages
- VPS with Nginx

---

## Troubleshooting

### App shows a blank white screen
- Check browser console for JavaScript errors
- Verify `VITE_BASE44_APP_ID` is set in `.env.local` if Base44-backed pages are used; check the browser console for Base44 SDK configuration errors.
- Ensure all imports resolve correctly (check for typos in `@/` alias paths)
- Run `npm run build` to check for build errors

### Authentication redirect loop
- Clear `localStorage` and try again
- Verify the Base44 app ID matches your account
- Check that the auth callback URL is correct

### API calls fail with 401/403
- Your session token may have expired — log out and log back in
- Verify your Base44 subscription is active
- Check that your app ID is correct

### Build fails
- Run `npm install` to ensure all dependencies are installed
- Run `npm run lint` to check for code errors
- Check for missing imports or syntax errors
- Ensure Node.js version is 18+

### Lazy-loaded pages don't load
- Check network tab for failed chunk requests
- Verify `RouteLoader` component is imported in `App.jsx`
- Ensure the Vite dev server is running

### Styles are missing
- Run `npm install` to ensure Tailwind CSS is installed
- Check that `src/index.css` is imported in `src/main.jsx`
- Verify `tailwind.config.js` content paths are correct

---

## FAQ

### What is Hacker gf?
Hacker gf is a production-ready AI SaaS platform designed for developers. It combines AI chat, a code editor, secure code execution, and file management into a single hacker-themed interface.

### Who is Zoya?
Zoya is the name of the AI assistant embedded in Hacker gf. When the assistant refers to itself, it always introduces itself as "Zoya."

### Which AI models are supported?
The platform supports GPT-5 Mini, GPT-5.4, GPT-5.5, Gemini 3 Flash, Gemini 3.1 Pro, Claude Sonnet 4.6, Claude Opus 4.6–4.8, Claude Sonnet 5, and an "Automatic" mode that selects the best model.

### Is my code executed securely?
Code execution happens in a browser-sandboxed environment. JavaScript code is executed client-side in an isolated context. Your code never runs on the application server.

### Can I upload my own files?
Yes. The platform supports PDF, DOCX, TXT, Markdown, JSON, CSV, ZIP, images, and source code files with automatic content extraction.

### What are the pricing plans?
Four plans are available: Free (50 AI messages/month, 1 GB storage), Pro ($20/month, unlimited messages, 25 GB), Team ($50/month, 100 GB shared storage), and Enterprise (custom pricing, unlimited everything).

### Is there an API?
API key management is available in the app. Keys can be created with specific permissions and expiration dates.

### Can I self-host?
Yes. After ejecting from Base44, the app can be deployed to any static hosting platform. See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions.

---

## Security Notes

- **Authentication**: JWT-based auth managed by the Base44 platform. Supports email/password and Google OAuth.
- **Authorization**: Role-based access control with roles: guest, user, pro, team, admin. Admins have full system access.
- **Protected routes**: All authenticated pages are guarded by `ProtectedRoute` which checks auth state before rendering.
- **Data isolation**: Entity queries are filtered by `created_by_id` to ensure users only access their own data.
- **Input validation**: Forms use React Hook Form with Zod schema validation.
- **Environment variables**: Secrets are managed by the Base44 platform. Never commit `.env.local` or API keys to the repository.
- **Security logging**: The `SecurityLog` entity tracks security-relevant actions (logins, API key creation, etc.).
- **Code execution**: Browser-sandboxed — no server-side execution of user code.
- **Error handling**: Global `ErrorBoundary` catches unhandled errors and provides recovery options.

> **Note**: The app does not implement CSRF tokens or rate limiting at the frontend level — these are handled by the Base44 platform.

---

## License

© Hacker gf. All rights reserved.

> **License Placeholder**: This project is currently proprietary. If open-sourcing, replace this section with an appropriate license (e.g., MIT, Apache 2.0) and include the full license text in a `LICENSE` file.

---

## Credits

- **Platform**: [Base44](https://base44.com) — Backend-as-a-Service
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) (New York style)
- **Icons**: [Lucide](https://lucide.dev)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org)
- **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **AI Models**: OpenAI (GPT-5), Google (Gemini), Anthropic (Claude)