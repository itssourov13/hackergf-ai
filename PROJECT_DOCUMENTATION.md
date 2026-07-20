# Project Documentation — Hacker gf

Complete technical documentation of the Hacker gf AI-powered development platform.

---

## Table of Contents

1. [Complete Project Architecture](#1-complete-project-architecture)
2. [Folder-by-Folder Explanation](#2-folder-by-folder-explanation)
3. [Purpose of Every Major Directory](#3-purpose-of-every-major-directory)
4. [Important Components](#4-important-components)
5. [Authentication Flow](#5-authentication-flow)
6. [API Flow](#6-api-flow)
7. [Database / Entity Overview](#7-database--entity-overview)
8. [Base44 Integration](#8-base44-integration)
9. [State Management](#9-state-management)
10. [Routing Overview](#10-routing-overview)
11. [File Upload Flow](#11-file-upload-flow)
12. [AI Integration](#12-ai-integration)
13. [Admin Panel Overview](#13-admin-panel-overview)
14. [Configuration Files Explanation](#14-configuration-files-explanation)
15. [Build System](#15-build-system)
16. [Deployment Workflow](#16-deployment-workflow)
17. [Development Workflow](#17-development-workflow)
18. [Production Workflow](#18-production-workflow)

---

## 1. Complete Project Architecture

Hacker gf is a **single-page application (SPA)** built on React 18 with Vite 6 as the build tool. The backend is entirely provided by the **Base44 platform** (Backend-as-a-Service), which handles authentication, database operations, AI model invocations, file storage, and analytics.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                         │
│                                                                  │
│  ┌────────────┐   ┌─────────────┐   ┌───────────────────────┐  │
│  │  React App  │   │  React Router│   │   AuthContext          │  │
│  │  (App.jsx)  │   │  (6 routes)  │   │   (AuthProvider)        │  │
│  └──────┬──────┘   └──────┬──────┘   └───────────┬───────────┘  │
│         │                 │                       │               │
│  ┌──────┴─────────────────┴───────────────────────┴────────────┐ │
│  │              Base44 SDK Client (base44Client.js)           │ │
│  │      (entities, auth, integrations, analytics, users)       │ │
│  └───────────────────────────┬────────────────────────────────┘ │
└───────────────────────────────┼──────────────────────────────────┘
                                │ HTTPS / API calls
┌───────────────────────────────┼──────────────────────────────────┐
│                      Base44 Platform (BaaS)                       │
│                                                                   │
│  ┌──────────┐  ┌───────────┐  ┌───────────┐  ┌──────────────┐  │
│  │   Auth    │  │ Database  │  │    AI     │  │    File      │  │
│  │ (JWT,     │  │ (MongoDB) │  │    LLM    │  │    Storage   │  │
│  │  OAuth)   │  │           │  │    APIs   │  │              │  │
│  └──────────┘  └───────────┘  └───────────┘  └──────────────┘  │
│                                                                   │
│  ┌──────────┐  ┌───────────┐  ┌───────────────────────────┐    │
│  │ Analytics │  │   Users   │  │   Integration Packages     │    │
│  │           │  │  (invites)│  │ (InvokeLLM, UploadFile,    │    │
│  │           │  │           │  │  GenerateImage, etc.)      │    │
│  └──────────┘  └───────────┘  └───────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

### Application Layers

1. **Entry Layer** (`src/main.jsx`) — Mounts the React app into the DOM and imports global CSS.
2. **Router Layer** (`src/App.jsx`) — Defines all routes, wraps them in providers (AuthProvider, QueryClientProvider, Router, ErrorBoundary, Toaster).
3. **Auth Layer** (`src/lib/AuthContext.jsx`, `src/components/ProtectedRoute.jsx`) — Manages authentication state, guards protected routes.
4. **Layout Layer** (`src/components/AppLayout.jsx`) — Provides the sidebar navigation and main content area for authenticated pages.
5. **Page Layer** (`src/pages/`) — Individual page components, lazy-loaded for code splitting.
6. **Component Layer** (`src/components/`) — Reusable UI components organized by feature.
7. **Data Layer** (`src/api/base44Client.js`, `src/lib/usage.js`) — Base44 SDK client and data utilities.
8. **Configuration Layer** (`src/lib/config/`) — Centralized configuration for plans, roles, models, etc.

---

## 2. Folder-by-Folder Explanation

### `base44/`
Base44 platform configuration and database schemas.

- `config.jsonc` — Defines site build commands, output directory, and serve command.
- `entities/` — JSON schema files for each database entity (Chat, Message, Project, File, Subscription, Settings, UsageRecord, ApiKey, SecurityLog, SupportTicket, Feedback, CodeSnippet). The built-in `User` entity is not stored here as it's platform-managed.

### `public/`
Static assets served directly by Vite. Contains the web manifest and any static images.

### `src/`
The entire frontend application source code.

#### `src/api/`
- `base44Client.js` — Creates and exports the pre-initialized Base44 SDK client. Reads app parameters from `src/lib/app-params.js` (app ID, token, functions version, base URL). Used by all components for entity CRUD, auth, and integrations.

#### `src/components/`
All React components, organized by domain:

- `chat/` — Chat-specific components: ChatSidebar, ChatMessage, ChatInputBar, ChatEmptyState, ThinkingIndicator, MessageActions, CodeBlock, AttachmentBottomSheet, AttachmentPreview, HackerAILogo.
- `feedback/` — Feedback portal components: FeedbackForm, FeedbackCard.
- `landing/` — Landing page sections: Navbar, Footer, Hero, FeaturesSection, HowItWorksSection, TechStackSection, PricingSection, FAQSection.
- `snippets/` — Code snippet components: SnippetForm, SnippetCard.
- `ui/` — shadcn/ui component primitives (60+ components) plus custom variants: button-custom.jsx, card-custom.jsx, badge-custom.jsx, container.jsx, section.jsx.
- `AppLayout.jsx` — Authenticated app shell with sectioned sidebar navigation.
- `AuthLayout.jsx` — Layout wrapper for auth pages (login, register, etc.).
- `ErrorBoundary.jsx` — Global error boundary with reset functionality.
- `GoogleIcon.jsx` — Google OAuth button icon.
- `ProtectedRoute.jsx` — Route guard component checking auth state.
- `RouteLoader.jsx` — Suspense fallback loading component for lazy-loaded routes.
- `ScrollToTop.jsx` — Scrolls to top on route change.
- `UserNotRegisteredError.jsx` — Error page shown when a user's account isn't registered for the app.
- `RouteLoader.jsx` — Loading indicator shown during lazy chunk loading.

#### `src/hooks/`
Custom React hooks:
- `use-mobile.jsx` — Detects mobile viewport.
- `use-size.jsx` — Element size tracking hook.

#### `src/lib/`
Shared library code:

- `config/` — Centralized configuration modules (see Section 14).
- `AuthContext.jsx` — React Context provider for authentication state. Manages user, auth status, loading states, errors, and app public settings. Calls Base44 SDK for auth checks.
- `app-params.js` — Extracts app parameters from URL query params and localStorage. Handles token extraction from URL (removes it after storing). Falls back to Vite environment variables.
- `PageNotFound.jsx` — 404 not found page component.
- `query-client.js` — Creates and exports the TanStack React Query client instance.
- `usage.js` — Usage tracking utilities. `trackUsage()` records usage metrics; `getUserUsage()` aggregates usage by billing period.
- `utils.js` — Shared utility functions including `cn()` (className merge) and `createPageUrl()`.

#### `src/pages/`
All application pages (25+). Each is a default-exported React component. Authenticated pages are lazy-loaded via `React.lazy()` in `App.jsx`.

#### `src/utils/`
- `index.ts` — Shared utility exports including `createPageUrl()`.

#### `src/App.jsx`
The main application router. Defines all routes, wraps them in providers, and handles auth-based route protection. Uses lazy loading for code splitting.

#### `src/main.jsx`
React entry point. Creates the root and renders `<App />`. Imports `src/index.css`.

#### `src/index.css`
Global styles including Tailwind CSS layers, CSS custom properties (design tokens), base element styles, focus-visible styles, reduced-motion support, text selection styling, custom scrollbar, markdown content styling, and shimmer/fade-in animations.

---

## 3. Purpose of Every Major Directory

| Directory | Purpose |
|---|---|
| `base44/` | Base44 platform configuration and entity schema definitions |
| `base44/entities/` | JSON schema files defining the database structure for each entity type |
| `public/` | Static files served as-is by the web server |
| `src/` | All frontend application source code |
| `src/api/` | API client initialization (Base44 SDK) |
| `src/components/` | Reusable React components organized by feature domain |
| `src/components/chat/` | Chat interface components (message rendering, input, sidebar) |
| `src/components/feedback/` | Feedback portal form and card components |
| `src/components/landing/` | Public landing page section components |
| `src/components/snippets/` | Code snippet library components |
| `src/components/ui/` | shadcn/ui primitives and custom component variants |
| `src/hooks/` | Custom React hooks |
| `src/lib/` | Shared library code (auth, config, utils, query client) |
| `src/lib/config/` | Centralized configuration modules (plans, roles, models, flags, limits) |
| `src/pages/` | Route-level page components |
| `src/utils/` | Shared utility functions |

---

## 4. Important Components

### `App.jsx`
The root component. Wraps the entire app in:
- `ErrorBoundary` — Catches unhandled errors
- `AuthProvider` — Provides auth context
- `QueryClientProvider` — Provides React Query client
- `BrowserRouter` — Provides routing
- `ScrollToTop` — Scrolls to top on navigation
- `Toaster` — Toast notifications

Defines the `AuthenticatedApp` component which:
1. Shows a loading spinner while checking auth/public settings
2. Shows `UserNotRegisteredError` if the user isn't registered
3. Renders all routes, with protected routes wrapped in `ProtectedRoute` and `AppLayout`

### `AppLayout.jsx`
The authenticated app shell. Provides:
- A fixed sidebar (desktop) / drawer (mobile) with sectioned navigation
- Navigation organized into sections: (unlabeled main items), Insights, Developer, Resources
- Admin-only section for admin users
- User profile section with logout
- Mobile top bar with menu toggle

### `ProtectedRoute.jsx`
Route guard component. Uses `useAuth()` to check authentication state. Shows a fallback spinner while loading, redirects unauthenticated users to `/login`, and shows `UserNotRegisteredError` for unregistered users. Renders `<Outlet />` for authenticated users.

### `AuthContext.jsx`
React Context provider for authentication. On mount, calls `checkAppState()` which:
1. Fetches app public settings from the Base44 API
2. If a token exists, calls `base44.auth.me()` to get the current user
3. Sets auth state (user, isAuthenticated, loading states, errors)

Provides: `user`, `isAuthenticated`, `isLoadingAuth`, `isLoadingPublicSettings`, `authError`, `appPublicSettings`, `authChecked`, `logout()`, `navigateToLogin()`, `checkUserAuth()`, `checkAppState()`.

### `base44Client.js`
Creates the Base44 SDK client with app parameters. Configured with `requiresAuth: false` (auth is handled by the AuthContext). Exported as `base44` and used throughout the app for entity operations, auth, integrations, and analytics.

### `app-params.js`
Extracts runtime parameters from the URL and localStorage:
- `app_id` — Base44 application ID (falls back to `VITE_BASE44_APP_ID`)
- `access_token` — Auth token (extracted from URL, then removed)
- `from_url` — Post-login redirect URL
- `functions_version` — Base44 functions version
- `app_base_url` — App base URL

Handles `clear_access_token` parameter for token cleanup.

### `ErrorBoundary.jsx`
Class-based error boundary. Catches errors, logs them to console, and displays a recovery UI with "Refresh Page" and "Try Again" buttons. Uses `role="alert"` and `aria-live="assertive"` for accessibility.

### `RouteLoader.jsx`
Loading fallback displayed by `<Suspense>` while lazy-loaded route chunks are being fetched. Shows a spinner with "Loading…" text and `role="status"` for accessibility.

---

## 5. Authentication Flow

### Overview

Authentication is managed entirely by the Base44 platform. The frontend uses the Base44 SDK for login, registration, token management, and session handling.

### Auth Context Initialization

1. On app mount, `AuthProvider` calls `checkAppState()`.
2. `checkAppState()` fetches app public settings from `/api/apps/public/prod/public-settings/by-id/{appId}`.
3. If a token exists in localStorage, it calls `base44.auth.me()` to verify the session and get the current user.
4. Auth state is set: `user`, `isAuthenticated`, `isLoadingAuth`, `authError`.

### Route Protection

- `ProtectedRoute` checks `isAuthenticated` and `authChecked` from the auth context.
- If not authenticated, it renders the `unauthenticatedElement` (typically `<Navigate to="/login" />`).
- If the user is not registered, it renders `UserNotRegisteredError`.
- While loading, it shows a spinner fallback.

### Login Flow

1. User navigates to `/login`.
2. Login page (`src/pages/Login.jsx`) provides email/password form and Google OAuth button.
3. On submit:
   - `base44.auth.loginViaEmailPassword(email, password)` is called.
   - On success, a hard redirect to `/` is performed (`window.location.href = '/'`).
4. Google OAuth:
   - `base44.auth.loginWithProvider('google', fromUrl)` redirects to Google.
   - After OAuth callback, the token is extracted from the URL by `app-params.js`.

### Registration Flow

1. User navigates to `/register`.
2. Registration page (`src/pages/Register.jsx`) provides email/password/confirm form and Google OAuth.
3. On submit:
   - `base44.auth.register({ email, password })` is called.
   - Registration does NOT log the user in — the user is unverified.
   - User is redirected to an OTP verification step.
4. OTP verification:
   - User enters the code received via email.
   - `base44.auth.verifyOtp({ email, otpCode })` is called.
   - On success, the returned access token is stored via `base44.auth.setToken()`.
   - Hard redirect to `/`.

### Password Reset Flow

1. User navigates to `/forgot-password`.
2. Enters email — `base44.auth.resetPasswordRequest(email)` is called.
3. A generic success message is always shown (the API hides whether the email exists).
4. User navigates to `/reset-password?token={resetToken}`.
5. Enters new password — `base44.auth.resetPassword({ resetToken, newPassword })` is called.
6. Hard redirect to `/login`.

### Logout Flow

- `base44.auth.logout(redirectUrl?)` clears the token and optionally redirects.
- The AuthContext's `logout()` method clears local state and calls the SDK's logout.

---

## 6. API Flow

### Request Flow

All API calls go through the Base44 SDK client (`src/api/base44Client.js`):

```
Component → base44.entities.{EntityName}.{operation}() → Base44 API → Response
```

### Entity Operations

The Base44 SDK provides these entity operations:

| Operation | Description |
|---|---|
| `.list(sort, limit)` | List all records (optionally sorted and limited) |
| `.filter(query, sort, limit)` | Filter records by query (e.g., `{ created_by_id: user.id }`) |
| `.get(id)` | Get a single record by ID |
| `.create(data)` | Create a new record |
| `.update(id, data)` | Update a record by ID |
| `.delete(id)` | Delete a record by ID |
| `.bulkCreate(items)` | Create multiple records (skips side effects) |
| `.bulkUpdate(items)` | Update multiple records with different data |
| `.updateMany(query, operators)` | Update all matching records (MongoDB operators) |
| `.deleteMany(query)` | Delete all matching records |
| `.schema()` | Get the JSON schema for the entity |
| `.subscribe(callback)` | Real-time subscription to entity changes |

### Integration Endpoints

| Integration | Description |
|---|---|
| `InvokeLLM` | Call AI models with prompt, optional web search, file context, and JSON schema response |
| `UploadFile` | Upload a file to Base44 storage, returns `{ file_url }` |
| `UploadPrivateFile` | Upload to private storage, returns `{ file_uri }` |
| `CreateFileSignedUrl` | Create a time-limited signed download URL |
| `ExtractDataFromUploadedFile` | Extract structured data from uploaded files (PDF, CSV, XLSX, JSON, HTML, images) |
| `TranscribeAudio` | Transcribe audio files to text (Whisper) |
| `SendEmail` | Send email to registered app users only |
| `GenerateImage` | Generate images using AI |
| `GenerateSpeech` | Text-to-speech (TTS) |
| `GenerateVideo` | Generate videos using AI (Veo 3.x) |

### Error Handling

The Base44 SDK throws errors on failed requests. Components typically use try/catch in user-facing flows (forms, auth) and let errors bubble up in data-fetching contexts (handled by React Query or ErrorBoundary).

---

## 7. Database / Entity Overview

The database is a MongoDB instance managed by the Base44 platform. Each entity is defined by a JSON schema in `base44/entities/`. Every record has built-in fields: `id`, `created_date`, `updated_date`, `created_by_id`.

### Entity Summary

| Entity | Purpose | Key Fields |
|---|---|---|
| **User** (built-in) | User accounts — managed by platform, cannot be created via SDK | `id`, `email`, `full_name`, `role`, `created_date` |
| **Chat** | AI conversation records | `title`, `model`, `system_prompt`, `pinned`, `last_message_at`, `message_count` |
| **Message** | Individual chat messages | `chat_id`, `role` (user/assistant/system), `content`, `model`, `tokens`, `edited` |
| **Project** | Code projects with files | `name`, `description`, `language`, `files[]`, `tags[]`, `is_public` |
| **File** | Uploaded files with extracted content | `name`, `file_url`, `file_type`, `file_size`, `mime_type`, `extracted_content`, `page_count`, `word_count`, `character_count`, `status` |
| **Subscription** | Billing and usage tracking | `plan`, `status`, `billing_cycle`, `stripe_customer_id`, `stripe_subscription_id`, `usage{}` |
| **Settings** | User preferences | `theme`, `preferred_model`, `code_editor_font_size`, `ai_system_prompt`, `ai_tone`, `ai_interaction_style`, `ai_response_length` |
| **UsageRecord** | Usage metrics tracking | `metric`, `value`, `metadata{}`, `period` |
| **ApiKey** | API key management | `name`, `key_prefix`, `key_hash`, `permissions[]`, `last_used`, `expires_at`, `is_active` |
| **SecurityLog** | Audit trail of security events | `action`, `ip_address`, `user_agent`, `details`, `severity` |
| **SupportTicket** | User support tickets | `subject`, `message`, `category`, `status`, `priority` |
| **Feedback** | Feature requests and bug reports | `title`, `description`, `category`, `status`, `votes` |
| **CodeSnippet** | Reusable code snippets | `title`, `description`, `code`, `language`, `tags[]`, `is_favorite` |

### Data Isolation

Records are filtered by `created_by_id` to ensure users only access their own data:
```javascript
base44.entities.Chat.filter({ created_by_id: user.id }, '-created_date', 20);
```

### User Entity

The User entity is built-in and platform-managed:
- Cannot be created or imported via the SDK (returns 405)
- Users join via invitations: `base44.users.inviteUser(email, role)`
- Only admins can list, update, or delete other users
- Fields: `id`, `created_date`, `full_name`, `email`, `role`

---

## 8. Base44 Integration

### SDK Client

The Base44 SDK client is initialized in `src/api/base44Client.js`:

```javascript
import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

export const base44 = createClient({
  appId: appParams.appId,
  token: appParams.token,
  functionsVersion: appParams.functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl: appParams.appBaseUrl
});
```

### Vite Plugin

The `@base44/vite-plugin` is configured in `vite.config.js` with:
- `legacySDKImports` — Supports legacy `@/integrations`, `@/entities` imports (disabled by default)
- `hmrNotifier` — Hot module replacement notifications
- `navigationNotifier` — Navigation event notifications
- `analyticsTracker` — Analytics tracking
- `visualEditAgent` — Visual editing support

### Platform Configuration

`base44/config.jsonc` defines:
- `installCommand`: `npm install`
- `buildCommand`: `npm run build`
- `serveCommand`: `npm run dev`
- `outputDirectory`: `./dist`

### App Parameters

`src/lib/app-params.js` extracts runtime parameters from:
1. URL query parameters (e.g., `?app_id=xxx&access_token=yyy`)
2. localStorage (persisted from previous URL params)
3. Vite environment variables (fallback)

The `access_token` is extracted from the URL and removed immediately for security.

---

## 9. State Management

### Auth State

Managed by `src/lib/AuthContext.jsx` using React Context. State includes:
- `user` — Current user object (null if not authenticated)
- `isAuthenticated` — Boolean auth status
- `isLoadingAuth` — Loading state for auth check
- `isLoadingPublicSettings` — Loading state for app settings
- `authError` — Error object if auth fails
- `authChecked` — Boolean indicating auth check completion
- `appPublicSettings` — App public settings from Base44

### Server State

Managed by **TanStack React Query** (`@tanstack/react-query`). The query client is created in `src/lib/query-client.js` and provided via `QueryClientProvider` in `App.jsx`.

### Local Component State

Most pages use local `useState` for UI state (forms, modals, loading indicators). The Base44 SDK calls are typically made in `useEffect` hooks.

### Real-time Updates

The Base44 SDK supports real-time subscriptions:
```javascript
const unsubscribe = base44.entities.Chat.subscribe((event) => {
  // event: { id, type: 'create'|'update'|'delete', data }
});
```

### Usage Tracking

`src/lib/usage.js` provides:
- `trackUsage(metric, value, metadata)` — Records a usage event
- `getUserUsage(period)` — Aggregates usage by billing period (YYYY-MM format)

---

## 10. Routing Overview

### Router Setup

Routing uses **React Router DOM 6** with `BrowserRouter`. All routes are defined in `src/App.jsx`.

### Route Structure

```
/ (public)                    → Home (landing page)
/login (public)               → Login
/register (public)            → Register
/forgot-password (public)    → ForgotPassword
/reset-password (public)      → ResetPassword

# Protected routes (wrapped in ProtectedRoute + AppLayout)
/dashboard                    → Dashboard
/files                        → FilesPage
/settings                     → SettingsPage
/billing                      → BillingPage
/analytics                    → AnalyticsPage
/api-keys                     → ApiKeysPage
/projects                     → ProjectsPage
/support                      → SupportPage
/docs                         → DocsPage
/status                       → StatusPage
/shortcuts                    → ShortcutsPage
/quotas                       → QuotasPage
/models                       → ModelsPage
/security-log                 → SecurityLogPage
/commands                     → CommandsPage
/usage-report                 → UsageReportPage
/system-status                → SystemStatusPage
/roadmap                      → RoadmapPage
/feedback                     → FeedbackPage
/persona-settings             → PersonaSettingsPage
/snippets                     → SnippetsPage
/profile                      → ProfilePage
/admin (admin only)           → AdminPage

# Protected full-screen routes (no AppLayout)
/chat                         → ChatPage
/chat/:chatId                 → ChatPage
/editor                       → EditorPage

* (catch-all)                 → PageNotFound
```

### Route Protection

Protected routes are wrapped in a layout route:
```jsx
<Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
  <Route element={<AppLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    ...
  </Route>
  <Route path="/chat" element={<ChatPage />} />
  <Route path="/editor" element={<EditorPage />} />
</Route>
```

### Code Splitting

All authenticated pages are lazy-loaded:
```jsx
const Dashboard = lazy(() => import('@/pages/Dashboard'));
```

Routes are wrapped in `<Suspense fallback={<RouteLoader />}>` which shows a loading indicator while chunks are fetched. Landing and auth pages are directly imported for fast initial load.

### Navigation

- `ScrollToTop` component scrolls to the top on every route change.
- `<Link to="/path">` from react-router-dom is used for client-side navigation.

---

## 11. File Upload Flow

### Upload Process

1. **User selects files** via drag-and-drop or file picker in `FilesPage.jsx`.
2. **Validation**: File type and size are checked against `UPLOAD_LIMITS` from `src/lib/config/uploadLimits.ts`.
3. **Upload**: `base44.integrations.Core.UploadFile({ file })` is called, which uploads the file to Base44 storage and returns `{ file_url }`.
4. **Record creation**: A `File` entity record is created with:
   - `name` — Original file name
   - `file_url` — URL returned by UploadFile
   - `file_type` — Category (pdf, docx, text, json, csv, zip, image, code)
   - `file_size` — Size in bytes
   - `mime_type` — MIME type
   - `status` — "uploading" → "processing" → "ready" (or "error")
5. **Content extraction**: For text-based files, `base44.integrations.Core.ExtractDataFromUploadedFile({ file_url, json_schema })` is called to extract structured content.
6. **Metadata**: Word count, character count, and page count are calculated and stored on the File record.

### Supported File Types

| Category | Extensions | Max Size |
|---|---|---|
| PDF | pdf | 100 MB |
| Word | docx, doc | 50 MB |
| Text | txt, md, markdown | 20 MB |
| JSON | json | 10 MB |
| CSV | csv | 10 MB |
| ZIP | zip | 250 MB |
| Image | png, jpg, jpeg, gif, webp, svg | 25 MB |
| Code | js, ts, tsx, jsx, py, html, css, java, go, rs, cpp, c, rb, php, sh, sql | 10 MB |

### Global Limits
- Max project upload: 500 MB
- Max files per upload: 500

---

## 12. AI Integration

### AI Model Configuration

AI models are configured in `src/lib/config/aiProviders.ts`:

| Model ID | Name | Provider | Premium | Web Search |
|---|---|---|---|---|
| automatic | Automatic | System | No | — |
| gpt_5_mini | GPT-5 Mini | OpenAI | No | — |
| gpt_5_4 | GPT-5.4 | OpenAI | Yes | — |
| gpt_5_5 | GPT-5.5 | OpenAI | Yes | — |
| gemini_3_flash | Gemini 3 Flash | Google | No | Yes |
| gemini_3_1_pro | Gemini 3.1 Pro | Google | Yes | Yes |
| claude_sonnet_4_6 | Claude Sonnet 4.6 | Anthropic | Yes | — |
| claude_opus_4_6 | Claude Opus 4.6 | Anthropic | Yes | — |
| claude_opus_4_7 | Claude Opus 4.7 | Anthropic | Yes | — |
| claude_opus_4_8 | Claude Opus 4.8 | Anthropic | Yes | — |
| claude-sonnet-5 | Claude Sonnet 5 | Anthropic | Yes | — |

### System Prompt

The AI assistant is named **Zoya**. The system prompt (from `aiProviders.ts`):

> "You are Zoya, an elite AI coding assistant from Hacker gf, embedded in a developer platform. When referring to yourself by name, always introduce yourself as 'Zoya' — never use the name 'HackerAI' or any other name. You help users write, debug, and understand code across multiple languages. Always provide clear, well-structured responses with code blocks when relevant. When explaining concepts, be concise but thorough. Use markdown formatting. If the user shares code, analyze it carefully and provide actionable feedback."

### AI Invocation

AI calls are made via `base44.integrations.Core.InvokeLLM()`:

```javascript
const result = await base44.integrations.Core.InvokeLLM({
  prompt: "Your prompt here",
  model: "automatic",  // or specific model ID
  add_context_from_internet: false,  // Only with gemini_3_flash or gemini_3_1_pro
  response_json_schema: { type: "object", properties: {} },  // Optional
  file_urls: ["https://..."],  // Optional file context
});
```

### Chat Flow

1. User sends a message in `ChatPage.jsx`.
2. A `Message` entity is created with `role: "user"`.
3. The conversation history is assembled into a prompt.
4. `InvokeLLM` is called with the prompt and selected model.
5. A thinking indicator is shown while waiting.
6. The AI response is rendered with markdown via `ChatMessage.jsx`.
7. A `Message` entity is created with `role: "assistant"`.
8. The `Chat` entity's `last_message_at` and `message_count` are updated.
9. Usage is tracked via `trackUsage('ai_message', 1, { model })`.

### Model Selection

Users can select AI models in the chat interface. The model selector shows premium badges for paid models. The selected model is stored on the `Chat` entity.

### Zoya Persona Settings

The `PersonaSettingsPage` allows users to configure:
- AI tone (professional, casual, friendly, concise, detailed)
- Interaction style (direct, explanatory, socratic, collaborative)
- Response length (concise, balanced, detailed)
- Custom system prompt override

These settings are stored on the `Settings` entity.

---

## 13. Admin Panel Overview

### Access Control

The admin panel (`/admin`) is accessible only to users with `role === "admin"`. The `AdminPage.jsx` component checks the user's role and shows an access denied message for non-admin users.

### Admin Sidebar

In `AppLayout.jsx`, an "Administration" section appears in the sidebar only for admin users, containing a link to `/admin`.

### Admin Dashboard Features

The `AdminPage.jsx` displays:
- **System statistics** — Total counts of entities (chats, messages, projects, files, users)
- **Billing cycle usage metrics** — Aggregated usage data
- **Feature flags** — Toggle features on/off (from `src/lib/config/featureFlags.ts`)
- **User list** — All registered users with roles

### Security Log

The `/security-log` page (`SecurityLogPage.jsx`) displays security-relevant events from the `SecurityLog` entity, including:
- Action type (login, logout, api_key_created, api_key_revoked, etc.)
- IP address
- User agent
- Severity (info, warning, critical)
- Additional details

### API Key Management

The `/api-keys` page (`ApiKeysPage.jsx`) allows users to:
- Create API keys with names and permissions
- View key prefixes (full keys are hashed and never shown again)
- Set expiration dates
- Activate/deactivate keys
- View last used timestamps

### User Management

Admins can invite users via `base44.users.inviteUser(email, role)` with roles "user" or "admin". Regular users can only invite with role "user".

---

## 14. Configuration Files Explanation

### `base44/config.jsonc`
Base44 platform site configuration:
- `installCommand`: `npm install`
- `buildCommand`: `npm run build`
- `serveCommand`: `npm run dev`
- `outputDirectory`: `./dist`

### `vite.config.js`
Vite configuration with the Base44 Vite plugin and React plugin. The Base44 plugin enables HMR notifications, navigation tracking, analytics, and visual editing.

### `tailwind.config.js`
Tailwind CSS configuration:
- Dark mode via `class` strategy
- Content paths: `index.html` and `src/**/*.{ts,tsx,js,jsx}`
- Custom design tokens mapped from CSS custom properties (colors, fonts, border radius)
- Custom animations (accordion-down, accordion-up)
- Plugin: `tailwindcss-animate`

### `postcss.config.js`
PostCSS configuration with Tailwind CSS and Autoprefixer plugins.

### `jsconfig.json`
TypeScript configuration for JavaScript projects:
- Path alias: `@/*` → `./src/*`
- JSX: react-jsx
- Module: esnext
- checkJs: true
- Includes: `src/components/**/*.js`, `src/pages/**/*.jsx`, `src/Layout.jsx`
- Excludes: `node_modules`, `dist`, `src/vite-plugins`, `src/components/ui`, `src/api`, `src/lib`

### `eslint.config.js`
ESLint 9 flat config:
- Applies to: `src/components/**/*.{js,mjs,cjs,jsx}`, `src/pages/**/*.{js,mjs,cjs,jsx}`, `src/Layout.jsx`
- Ignores: `src/lib/**/*`, `src/components/ui/**/*`
- Plugins: @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-unused-imports
- Key rules: no-unused-vars off (handled by unused-imports), react-hooks/rules-of-hooks error, unused-imports/no-unused-imports error

### `components.json`
shadcn/ui configuration:
- Style: New York
- RSC: false
- TSX: false
- Base color: neutral
- CSS variables: true
- Icon library: Lucide
- Aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`

### `src/lib/config/plans.ts`
Subscription plan definitions (Free, Pro, Team, Enterprise) with pricing, features, and limits (AI messages, storage, file uploads, code executions, max conversations).

### `src/lib/config/roles.ts`
Role definitions (guest, user, pro, team, admin) with permission arrays. Provides `getRole()`, `hasPermission()`, and `isAdmin()` helper functions.

### `src/lib/config/uploadLimits.ts`
File upload configuration per file type (extensions, max size, icon, label). Provides `getFileCategory()`, `getMaxSizeForFile()`, and `ACCEPTED_EXTENSIONS`.

### `src/lib/config/featureFlags.ts`
Feature flag definitions with plan-based access control. Features: ai_chat, code_editor, code_execution, file_upload, advanced_models, team_collaboration, maintenance_mode. Provides `isFeatureEnabled()`.

### `src/lib/config/aiProviders.ts`
AI model definitions with provider, description, premium status, and capabilities (web search, vision). Includes the system prompt for Zoya. Provides `DEFAULT_MODEL` and `SYSTEM_PROMPT`.

### `src/lib/config/constants.ts`
App-level constants: app name, tagline, description, URL, support email, version. Navigation links, social links, FAQ items, feature descriptions, how-it-works steps, and tech stack list.

### `src/index.css`
Global styles and design tokens:
- CSS custom properties for `:root` (light theme) and `.dark` (dark theme)
- Base element styles (body, html, buttons)
- Focus-visible styles for keyboard navigation
- Text selection styling
- Reduced motion preferences
- Custom scrollbar
- Markdown content styling (`.md-content`)
- Shimmer and fade-in animations

### `src/lib/app-params.js`
Runtime parameter extraction from URL and localStorage. Handles token cleanup and environment variable fallbacks.

### `src/lib/query-client.js`
React Query client instance creation.

### `src/lib/usage.js`
Usage tracking utilities for recording and aggregating usage metrics.

---

## 15. Build System

### Build Tool

The project uses **Vite 6** as the build tool and dev server. The `@base44/vite-plugin` extends Vite with Base44-specific features.

### Build Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `./dist` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run typecheck` | Run TypeScript type checking |

### Build Output

The production build outputs to `./dist` (configured in both `base44/config.jsonc` and the default Vite output). The build produces:
- Static HTML, CSS, and JavaScript files
- Code-split chunks for lazy-loaded routes
- Asset files (images, fonts)

### Code Splitting

Authenticated pages are lazy-loaded via `React.lazy()` + dynamic `import()`. This creates separate chunks per page, loaded on demand when the user navigates to that route. The `<Suspense>` boundary in `App.jsx` shows `RouteLoader` during chunk loading.

### CSS Processing

Tailwind CSS processes utility classes. The `tailwind.config.js` content paths ensure only used classes are included in the production build (tree-shaking). PostCSS with Autoprefixer handles vendor prefixes.

---

## 16. Deployment Workflow

### On Base44 Platform

1. Develop using the Base44 Builder or locally.
2. The platform handles deployment automatically using the commands in `base44/config.jsonc`.
3. The app is served from the Base44 infrastructure.

### After Ejecting

1. Run `npm run build` to produce the `./dist` folder.
2. Deploy the static files to any static hosting provider.
3. Set environment variables (`VITE_BASE44_APP_ID`) on the hosting platform.
4. Configure SPA routing (redirect all routes to `index.html`).

See [DEPLOYMENT.md](./DEPLOYMENT.md) for platform-specific instructions.

---

## 17. Development Workflow

### Local Development

1. Clone the repository.
2. Run `npm install`.
3. Create `.env.local` with `VITE_BASE44_APP_ID`.
4. Run `npm run dev`.
5. Open `http://localhost:5173`.
6. Make changes — HMR provides instant feedback.

### Code Quality

Before committing:
```bash
npm run lint       # Check for lint errors
npm run typecheck  # Type-check
npm run build      # Verify production build
```

### Adding a New Page

1. Create a new component in `src/pages/NewPage.jsx`.
2. Add a lazy import and route in `src/App.jsx`.
3. Add a navigation link in `src/components/AppLayout.jsx` (if needed).
4. Create any supporting components in `src/components/`.

### Adding a New Entity

1. Create a JSON schema in `base44/entities/NewEntity.jsonc`.
2. Use `base44.entities.NewEntity.*` in components.
3. Optionally seed data using `create_entity_records`.

### Adding a New Configuration

1. Create a new config file in `src/lib/config/newConfig.ts`.
2. Export typed constants and helper functions.
3. Import and use in components.

---

## 18. Production Workflow

### Production Checklist

- [ ] All features tested manually
- [ ] `npm run lint` passes with no errors
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] `npm run preview` works correctly
- [ ] Environment variables are set on the hosting platform
- [ ] SPA routing is configured (all routes redirect to `index.html`)
- [ ] HTTPS is enabled
- [ ] SEO meta tags are correct (title, description, OG, Twitter Cards, JSON-LD)
- [ ] Error boundary is in place
- [ ] Loading states are implemented for all async operations
- [ ] Mobile responsiveness verified
- [ ] Accessibility (focus states, ARIA labels, reduced motion) verified
- [ ] No secrets committed to the repository

### Production Build

```bash
npm run build
```

Output: `./dist/` containing static files ready for deployment.

### Monitoring

- **Analytics**: Custom events tracked via `base44.analytics.track()`
- **Usage**: Tracked via `UsageRecord` entities and `src/lib/usage.js`
- **Security**: Logged via `SecurityLog` entities
- **Errors**: Caught by `ErrorBoundary` and logged to console