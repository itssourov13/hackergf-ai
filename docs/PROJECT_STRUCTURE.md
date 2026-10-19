# Project Structure — Hacker gf

Complete folder tree with explanations for every major folder and important file.

---

## Complete Folder Tree

```
hacker-gf/
│
├── base44/                                    # Base44 platform configuration
│   ├── config.jsonc                           # Site build/serve configuration
│   └── entities/                              # Database entity schemas
│       ├── ApiKey.jsonc                       # API key management schema
│       ├── Chat.jsonc                         # AI conversation schema
│       ├── CodeSnippet.jsonc                  # Code snippet library schema
│       ├── Feedback.jsonc                     # Feedback/feature request schema
│       ├── File.jsonc                         # Uploaded file schema
│       ├── Message.jsonc                      # Chat message schema
│       ├── Project.jsonc                      # Code project schema
│       ├── SecurityLog.jsonc                  # Security audit log schema
│       ├── Settings.jsonc                     # User settings schema
│       ├── Subscription.jsonc                 # Billing/subscription schema
│       ├── SupportTicket.jsonc                # Support ticket schema
│       └── UsageRecord.jsonc                  # Usage tracking schema
│
├── public/                                   # Static assets served as-is
│   └── manifest.json                          # PWA manifest (if present)
│
├── src/                                       # Frontend application source
│   ├── api/                                   # API client initialization
│   │   └── base44Client.js                    # Pre-initialized Base44 SDK client
│   │
│   ├── components/                            # All React components
│   │   ├── chat/                              # Chat interface components
│   │   │   ├── AttachmentBottomSheet.jsx       # File attachment picker
│   │   │   ├── AttachmentPreview.jsx           # Attachment preview chip
│   │   │   ├── ChatEmptyState.jsx              # Empty state with suggested prompts
│   │   │   ├── ChatInputBar.jsx                # Message input with auto-resize
│   │   │   ├── ChatMessage.jsx                # Individual message rendering
│   │   │   ├── ChatSidebar.jsx                 # Conversation list sidebar
│   │   │   ├── CodeBlock.jsx                   # Syntax-highlighted code block
│   │   │   ├── HackerAILogo.jsx                # Brand logo component
│   │   │   ├── MessageActions.jsx              # Copy/regenerate actions
│   │   │   └── ThinkingIndicator.jsx           # AI "thinking" animation
│   │   │
│   │   ├── feedback/                          # Feedback portal components
│   │   │   ├── FeedbackCard.jsx                # Feedback item card with voting
│   │   │   └── FeedbackForm.jsx                # New feedback submission form
│   │   │
│   │   ├── landing/                           # Landing page sections
│   │   │   ├── FAQSection.jsx                  # FAQ accordion section
│   │   │   ├── FeaturesSection.jsx             # Feature grid section
│   │   │   ├── Footer.jsx                      # Site footer
│   │   │   ├── Hero.jsx                        # Hero section with CTA
│   │   │   ├── HowItWorksSection.jsx           # Step-by-step process section
│   │   │   ├── Navbar.jsx                      # Sticky responsive navbar
│   │   │   ├── PricingSection.jsx             # Pricing plans section
│   │   │   └── TechStackSection.jsx            # Technology stack section
│   │   │
│   │   ├── snippets/                          # Code snippet components
│   │   │   ├── SnippetCard.jsx                 # Snippet display card
│   │   │   └── SnippetForm.jsx                 # Snippet create/edit form
│   │   │
│   │   ├── ui/                                # shadcn/ui primitives + custom
│   │   │   ├── accordion.jsx                   # Accordion component
│   │   │   ├── alert-dialog.jsx                # Alert dialog component
│   │   │   ├── alert.jsx                       # Alert component
│   │   │   ├── aspect-ratio.jsx                # Aspect ratio container
│   │   │   ├── avatar.jsx                      # Avatar component
│   │   │   ├── badge-custom.jsx                # Custom badge with theme variants
│   │   │   ├── badge.jsx                       # shadcn badge component
│   │   │   ├── breadcrumb.jsx                  # Breadcrumb navigation
│   │   │   ├── button-custom.jsx               # Custom button with red theme
│   │   │   ├── button.jsx                      # shadcn button component
│   │   │   ├── calendar.jsx                     # Calendar component
│   │   │   ├── card-custom.jsx                 # Custom card with dark theme
│   │   │   ├── card.jsx                        # shadcn card component
│   │   │   ├── carousel.jsx                    # Carousel component
│   │   │   ├── chart.jsx                       # Chart component
│   │   │   ├── checkbox.jsx                    # Checkbox component
│   │   │   ├── collapsible.jsx                 # Collapsible component
│   │   │   ├── command.jsx                     # Command palette component
│   │   │   ├── context-menu.jsx                # Context menu component
│   │   │   ├── container.jsx                   # Layout container component
│   │   │   ├── dialog.jsx                      # Dialog/modal component
│   │   │   ├── drawer.jsx                       # Drawer component
│   │   │   ├── dropdown-menu.jsx               # Dropdown menu component
│   │   │   ├── form.jsx                        # Form components (React Hook Form)
│   │   │   ├── hover-card.jsx                  # Hover card component
│   │   │   ├── image.jsx                       # Image component
│   │   │   ├── input-otp.jsx                   # OTP input component
│   │   │   ├── input.jsx                       # Input component
│   │   │   ├── label.jsx                       # Label component
│   │   │   ├── menubar.jsx                     # Menu bar component
│   │   │   ├── navigation-menu.jsx             # Navigation menu component
│   │   │   ├── pagination.jsx                  # Pagination component
│   │   │   ├── popover.jsx                     # Popover component
│   │   │   ├── progress.jsx                    # Progress bar component
│   │   │   ├── radio-group.jsx                 # Radio group component
│   │   │   ├── resizable.jsx                   # Resizable panels component
│   │   │   ├── scroll-area.jsx                 # Scroll area component
│   │   │   ├── section.jsx                     # Layout section component
│   │   │   ├── select.jsx                      # Select dropdown component
│   │   │   ├── separator.jsx                   # Separator component
│   │   │   ├── sheet.jsx                       # Sheet component
│   │   │   ├── sidebar.jsx                     # Sidebar component
│   │   │   ├── skeleton.jsx                    # Skeleton loading component
│   │   │   ├── slider.jsx                      # Slider component
│   │   │   ├── sonner.jsx                      # Sonner toast component
│   │   │   ├── switch.jsx                      # Toggle switch component
│   │   │   ├── table.jsx                       # Table component
│   │   │   ├── tabs.jsx                        # Tabs component
│   │   │   ├── textarea.jsx                    # Textarea component
│   │   │   ├── toast.jsx                       # Toast component
│   │   │   ├── toaster.jsx                     # Toaster container component
│   │   │   ├── toggle-group.jsx                # Toggle group component
│   │   │   ├── toggle.jsx                      # Toggle component
│   │   │   ├── tooltip.jsx                     # Tooltip component
│   │   │   └── use-toast.jsx                   # Toast hook
│   │   │
│   │   ├── AppLayout.jsx                      # Authenticated app shell with sidebar
│   │   ├── AuthLayout.jsx                     # Auth page layout wrapper
│   │   ├── ErrorBoundary.jsx                  # Global error boundary with reset
│   │   ├── GoogleIcon.jsx                     # Google OAuth icon
│   │   ├── ProtectedRoute.jsx                 # Route auth guard
│   │   ├── RouteLoader.jsx                    # Suspense fallback loader
│   │   ├── ScrollToTop.jsx                    # Scroll-to-top on navigation
│   │   └── UserNotRegisteredError.jsx         # Unregistered user error page
│   │
│   ├── hooks/                                 # Custom React hooks
│   │   ├── use-mobile.jsx                     # Mobile viewport detection
│   │   └── use-size.jsx                       # Element size tracking
│   │
│   ├── lib/                                   # Shared library code
│   │   ├── config/                            # Centralized configuration
│   │   │   ├── aiProviders.ts                 # AI model definitions + system prompt
│   │   │   ├── constants.ts                   # App constants, nav links, FAQ
│   │   │   ├── featureFlags.ts                # Feature flag definitions
│   │   │   ├── plans.ts                       # Subscription plan definitions
│   │   │   ├── roles.ts                       # Role and permission definitions
│   │   │   └── uploadLimits.ts                # File upload limits per type
│   │   │
│   │   ├── AuthContext.jsx                   # Auth context provider
│   │   ├── app-params.js                     # App parameter extraction
│   │   ├── PageNotFound.jsx                  # 404 page component
│   │   ├── query-client.js                   # React Query client
│   │   ├── usage.js                          # Usage tracking utilities
│   │   └── utils.js                          # Shared utilities (cn, createPageUrl)
│   │
│   ├── pages/                                 # All application pages
│   │   ├── AdminPage.jsx                     # Admin dashboard (admin only)
│   │   ├── AnalyticsPage.jsx                 # Usage analytics with charts
│   │   ├── ApiKeysPage.jsx                   # API key management
│   │   ├── BillingPage.jsx                   # Subscription & billing
│   │   ├── ChatPage.jsx                      # AI chat interface (full-screen)
│   │   ├── CommandsPage.jsx                 # Quick commands reference
│   │   ├── Dashboard.jsx                     # Main dashboard
│   │   ├── DocsPage.jsx                      # In-app documentation
│   │   ├── EditorPage.jsx                    # Code editor (full-screen)
│   │   ├── FeedbackPage.jsx                  # Feedback portal with voting
│   │   ├── FilesPage.jsx                     # File upload & management
│   │   ├── ForgotPassword.jsx                # Password reset request
│   │   ├── Home.jsx                          # Landing page
│   │   ├── Login.jsx                         # Login page
│   │   ├── ModelsPage.jsx                    # AI model comparison
│   │   ├── PersonaSettingsPage.jsx           # Zoya AI persona settings
│   │   ├── ProfilePage.jsx                   # User profile
│   │   ├── ProjectsPage.jsx                  # Code project management
│   │   ├── QuotasPage.jsx                    # Usage quotas
│   │   ├── Register.jsx                      # Registration page
│   │   ├── ResetPassword.jsx                 # Password reset page
│   │   ├── RoadmapPage.jsx                   # Product roadmap
│   │   ├── SecurityLogPage.jsx               # Security audit log
│   │   ├── SettingsPage.jsx                 # User settings
│   │   ├── ShortcutsPage.jsx                 # Keyboard shortcuts reference
│   │   ├── SnippetsPage.jsx                  # Code snippet library
│   │   ├── StatusPage.jsx                    # Service status page
│   │   ├── SupportPage.jsx                   # Support center
│   │   ├── SystemStatusPage.jsx              # System status dashboard
│   │   └── UsageReportPage.jsx               # Usage report
│   │
│   ├── utils/                                 # Shared utilities
│   │   └── index.ts                          # Utility exports
│   │
│   ├── App.jsx                                # Main router & app composition
│   ├── main.jsx                               # React entry point
│   └── index.css                             # Global styles & design tokens
│
├── index.html                                 # HTML entry with SEO meta tags
├── package.json                               # Dependencies and scripts
├── vite.config.js                             # Vite configuration
├── tailwind.config.js                         # Tailwind CSS configuration
├── postcss.config.js                          # PostCSS configuration
├── jsconfig.json                              # TypeScript path aliases
├── eslint.config.js                           # ESLint configuration
├── components.json                            # shadcn/ui configuration
├── .gitignore                                 # Git ignore rules
├── AGENTS.md                                  # AI agent instructions (keep at root)
├── CLAUDE.md                                  # Claude agent instructions (keep at root)
├── README.md                                  # Project overview and quick start
└── docs/                                      # Project documentation
    ├── HANDOFF.md                             # Current engineering handoff
    ├── DEPLOYMENT.md                          # Deployment guide
    ├── DEVELOPER_GUIDE.md                     # Developer guide
    ├── PROJECT_DOCUMENTATION.md               # Technical documentation
    └── PROJECT_STRUCTURE.md                   # This file
```

---

## Folder Explanations

### `base44/`

Base44 platform configuration and database entity definitions. This folder is managed by the Base44 platform and defines how the app is built, served, and what data structures exist.

#### `base44/config.jsonc`

Defines the site configuration for the Base44 platform:
- `installCommand`: `npm install` — Command to install dependencies
- `buildCommand`: `npm run build` — Command to build the production bundle
- `serveCommand`: `npm run dev` — Command to serve in development
- `outputDirectory`: `./dist` — Where the build output goes

#### `base44/entities/`

Contains JSON schema files for each database entity. Each file defines the properties, types, defaults, and required fields for that entity. The platform uses these schemas to create and manage MongoDB collections.

**Entity files:**

| File | Entity | Purpose |
|---|---|---|
| `ApiKey.jsonc` | ApiKey | API key management with permissions and expiration |
| `Chat.jsonc` | Chat | AI conversation records with model and message count |
| `CodeSnippet.jsonc` | CodeSnippet | Reusable code snippets with tags and favorites |
| `Feedback.jsonc` | Feedback | Feature requests and bug reports with voting |
| `File.jsonc` | File | Uploaded files with extracted content and metadata |
| `Message.jsonc` | Message | Individual chat messages (user/assistant/system) |
| `Project.jsonc` | Project | Code projects with embedded file array |
| `SecurityLog.jsonc` | SecurityLog | Security audit trail with severity levels |
| `Settings.jsonc` | Settings | User preferences including AI persona config |
| `Subscription.jsonc` | Subscription | Billing plans, status, and usage tracking |
| `SupportTicket.jsonc` | SupportTicket | User support tickets with priority |
| `UsageRecord.jsonc` | UsageRecord | Usage metrics by billing period |

> **Note**: The `User` entity is built-in and platform-managed — no schema file exists for it. Users are created through the Base44 auth system (registration/invitation), not via entity creation.

---

### `public/`

Static assets served directly by the web server. Files here are copied to the build output as-is without processing.

---

### `src/`

The entire frontend application source code. This is where all development happens.

#### `src/api/`

API client initialization.

##### `src/api/base44Client.js`

Creates and exports the pre-initialized Base44 SDK client. Reads app parameters from `src/lib/app-params.js` (app ID, auth token, functions version, base URL). This client is imported throughout the app as `base44` and used for:
- Entity CRUD operations (`base44.entities.{EntityName}.*`)
- Authentication (`base44.auth.*`)
- AI integrations (`base44.integrations.Core.*`)
- Analytics (`base44.analytics.track()`)
- User management (`base44.users.inviteUser()`)

---

#### `src/components/`

All React components, organized by feature domain.

##### `src/components/chat/`

Chat interface components used by `ChatPage.jsx`:

| File | Component | Purpose |
|---|---|---|
| `AttachmentBottomSheet.jsx` | AttachmentBottomSheet | File attachment picker (bottom sheet on mobile) |
| `AttachmentPreview.jsx` | AttachmentPreview | Attachment preview chip in the input bar |
| `ChatEmptyState.jsx` | ChatEmptyState | Empty state with suggested prompts and branding |
| `ChatInputBar.jsx` | ChatInputBar | Auto-expanding textarea with send/stop button |
| `ChatMessage.jsx` | ChatMessage | Renders user/assistant messages with markdown |
| `ChatSidebar.jsx` | ChatSidebar | Conversation list with create/delete/switch |
| `CodeBlock.jsx` | CodeBlock | Syntax-highlighted code block with copy button |
| `HackerAILogo.jsx` | HackerAILogo | Brand logo component |
| `MessageActions.jsx` | MessageActions | Copy/regenerate action buttons for AI messages |
| `ThinkingIndicator.jsx` | ThinkingIndicator | Animated "thinking" indicator before AI response |

##### `src/components/feedback/`

Feedback portal components used by `FeedbackPage.jsx`:

| File | Component | Purpose |
|---|---|---|
| `FeedbackCard.jsx` | FeedbackCard | Displays a feedback item with voting and status badge |
| `FeedbackForm.jsx` | FeedbackForm | Form for submitting new feedback |

##### `src/components/landing/`

Landing page section components used by `Home.jsx`:

| File | Component | Purpose |
|---|---|---|
| `FAQSection.jsx` | FAQSection | Accordion FAQ section |
| `FeaturesSection.jsx` | FeaturesSection | Feature grid with icons |
| `Footer.jsx` | Footer | Site footer with links |
| `Hero.jsx` | Hero | Hero section with CTA buttons |
| `HowItWorksSection.jsx` | HowItWorksSection | Step-by-step process |
| `Navbar.jsx` | Navbar | Sticky responsive navbar with mobile menu |
| `PricingSection.jsx` | PricingSection | Pricing plan cards |
| `TechStackSection.jsx` | TechStackSection | Technology stack display |

##### `src/components/snippets/`

Code snippet components used by `SnippetsPage.jsx`:

| File | Component | Purpose |
|---|---|---|
| `SnippetCard.jsx` | SnippetCard | Displays a code snippet with copy/favorite actions |
| `SnippetForm.jsx` | SnippetForm | Form for creating/editing snippets |

##### `src/components/ui/`

shadcn/ui component primitives (60+ files) plus custom variants:

**Custom variants** (themed for the hacker aesthetic):
- `badge-custom.jsx` — Badge with red/secondary/success/warning variants
- `button-custom.jsx` — Button with red primary, outline, ghost variants
- `card-custom.jsx` — Card with dark zinc background and red accents
- `container.jsx` — Layout container with max-width
- `section.jsx` — Layout section with padding

**Standard shadcn/ui components**: accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, image, input-otp, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip, use-toast.

> **Note**: The `ui/` folder is excluded from ESLint (see `eslint.config.js`) and from jsconfig.json type-checking. These are generated/managed by shadcn/ui.

##### Top-level components in `src/components/`

| File | Component | Purpose |
|---|---|---|
| `AppLayout.jsx` | AppLayout | Authenticated app shell with sectioned sidebar navigation. Contains the sidebar (desktop fixed / mobile drawer), mobile top bar, and `<Outlet />` for page content. Navigation organized into sections: main items, Insights, Developer, Resources. Admin section shown only for admin users. |
| `AuthLayout.jsx` | AuthLayout | Layout wrapper for auth pages (login, register, forgot password, reset password). |
| `ErrorBoundary.jsx` | ErrorBoundary | Class-based error boundary wrapping the entire app. Catches errors, logs to console, displays recovery UI with "Refresh Page" and "Try Again" buttons. Uses `role="alert"` for accessibility. |
| `GoogleIcon.jsx` | GoogleIcon | Google "G" icon SVG for OAuth buttons. |
| `ProtectedRoute.jsx` | ProtectedRoute | Route guard component. Uses `useAuth()` to check authentication. Shows spinner while loading, redirects to `/login` if unauthenticated, shows `UserNotRegisteredError` for unregistered users. Renders `<Outlet />` for authenticated users. |
| `RouteLoader.jsx` | RouteLoader | Loading indicator displayed by `<Suspense>` while lazy-loaded route chunks load. Shows a spinner with "Loading…" text and `role="status"`. |
| `ScrollToTop.jsx` | ScrollToTop | Component that scrolls to top on every route change. Placed inside `<Router>` in `App.jsx`. |
| `UserNotRegisteredError.jsx` | UserNotRegisteredError | Error page shown when a user's account is authenticated but not registered for the app. |

---

#### `src/hooks/`

Custom React hooks:

| File | Hook | Purpose |
|---|---|---|
| `use-mobile.jsx` | useMobile | Detects mobile viewport using `matchMedia`. Returns boolean. |
| `use-size.jsx` | useSize | Tracks element dimensions using ResizeObserver. Returns ref and size. |

---

#### `src/lib/`

Shared library code: auth context, configuration, utilities, and query client.

##### `src/lib/config/`

Centralized configuration modules (all TypeScript for type safety):

| File | Purpose | Exports |
|---|---|---|
| `aiProviders.ts` | AI model definitions, system prompt, default model | `AI_MODELS`, `DEFAULT_MODEL`, `SYSTEM_PROMPT`, types `ModelId`, `AIModelConfig` |
| `constants.ts` | App constants, navigation links, social links, FAQ, features | `APP_CONFIG`, `NAV_LINKS`, `SOCIAL_LINKS`, `FAQ_ITEMS`, `FEATURES`, `HOW_IT_WORKS`, `TECH_STACK` |
| `featureFlags.ts` | Feature flag definitions with plan-based access | `FEATURE_FLAGS`, `isFeatureEnabled()`, type `FeatureFlag` |
| `plans.ts` | Subscription plan definitions | `PLANS`, `PLAN_LIST`, `getPlan()`, types `PlanId`, `PlanConfig` |
| `roles.ts` | Role and permission definitions | `ROLES`, `getRole()`, `hasPermission()`, `isAdmin()`, types `RoleId`, `RoleConfig` |
| `uploadLimits.ts` | File upload limits per type | `UPLOAD_LIMITS`, `GLOBAL_LIMITS`, `ACCEPTED_EXTENSIONS`, `getFileCategory()`, `getMaxSizeForFile()` |

##### Other files in `src/lib/`

| File | Purpose |
|---|---|
| `AuthContext.jsx` | React Context provider for authentication state. Manages user, auth status, loading states, errors, and app public settings. Calls Base44 SDK for auth checks and provides auth methods to the app. |
| `app-params.js` | Extracts app parameters from URL query strings and localStorage. Handles token extraction (removes from URL after storing), environment variable fallbacks, and token cleanup. |
| `PageNotFound.jsx` | 404 not found page component. |
| `query-client.js` | Creates and exports the TanStack React Query client instance. |
| `usage.js` | Usage tracking utilities. `trackUsage()` records usage metrics to the `UsageRecord` entity. `getUserUsage()` aggregates usage by billing period (YYYY-MM format). |
| `utils.js` | Shared utility functions. Exports `cn()` for className merging (clsx + tailwind-merge) and other helpers. |

---

#### `src/pages/`

All application pages (25+). Each file exports a default React component. Authenticated pages are lazy-loaded in `App.jsx` via `React.lazy()` + dynamic `import()`.

**Public pages** (directly imported, not lazy-loaded):
- `Home.jsx` — Landing page with Hero, Features, How It Works, Tech Stack, Pricing, FAQ
- `Login.jsx` — Login with email/password and Google OAuth
- `Register.jsx` — Registration with email/password, Google OAuth, and OTP verification
- `ForgotPassword.jsx` — Password reset request
- `ResetPassword.jsx` — Password reset with token

**Protected pages** (lazy-loaded, wrapped in AppLayout):
- `Dashboard.jsx` — Central hub with stats and quick actions
- `FilesPage.jsx` — File upload, management, and content extraction
- `SettingsPage.jsx` — User settings (AI preferences, editor, notifications)
- `BillingPage.jsx` — Subscription management and plan selection
- `AnalyticsPage.jsx` — Usage analytics with charts (Recharts)
- `ApiKeysPage.jsx` — API key creation and management
- `ProjectsPage.jsx` — Code project management
- `SupportPage.jsx` — Support ticket submission
- `DocsPage.jsx` — In-app documentation
- `StatusPage.jsx` — Service status dashboard
- `ShortcutsPage.jsx` — Keyboard shortcuts reference
- `QuotasPage.jsx` — Usage quota tracking
- `ModelsPage.jsx` — AI model comparison
- `SecurityLogPage.jsx` — Security audit log viewer
- `CommandsPage.jsx` — Quick commands reference
- `UsageReportPage.jsx` — Usage report
- `SystemStatusPage.jsx` — System status dashboard
- `RoadmapPage.jsx` — Product roadmap
- `FeedbackPage.jsx` — Feedback portal with voting
- `PersonaSettingsPage.jsx` — Zoya AI persona configuration
- `SnippetsPage.jsx` — Code snippet library
- `ProfilePage.jsx` — User profile
- `AdminPage.jsx` — Admin dashboard (admin only)

**Protected full-screen pages** (lazy-loaded, no AppLayout):
- `ChatPage.jsx` — AI chat interface (full-screen with its own sidebar)
- `EditorPage.jsx` — Code editor (full-screen with multi-tab and terminal)

---

#### `src/utils/`

| File | Purpose |
|---|---|
| `index.ts` | Shared utility exports including `createPageUrl()` for generating page URLs. |

---

#### `src/App.jsx`

The main application router and composition root. Responsibilities:
- Imports all providers (AuthProvider, QueryClientProvider, BrowserRouter, ErrorBoundary, Toaster)
- Imports all pages (direct imports for public pages, lazy imports for protected pages)
- Defines the `AuthenticatedApp` component that:
  - Shows loading spinner while checking auth/public settings
  - Shows `UserNotRegisteredError` for unregistered users
  - Wraps all routes in `<Suspense fallback={<RouteLoader />}>`
  - Defines public routes (/, /login, /register, /forgot-password, /reset-password)
  - Defines protected routes wrapped in `<ProtectedRoute>` and `<AppLayout>`
  - Defines full-screen protected routes (chat, editor) without AppLayout
  - Defines catch-all 404 route
- Defines the `App` component that wraps everything in providers

---

#### `src/main.jsx`

React entry point. Creates the root via `ReactDOM.createRoot()` and renders `<App />`. Imports `src/index.css` for global styles.

---

#### `src/index.css`

Global styles and design tokens. Contains:
- Tailwind CSS layers (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
- CSS custom properties for `:root` (light theme) and `.dark` (dark theme) — colors, fonts, border radius, chart colors, sidebar colors
- Base element styles (body, html, buttons)
- `:focus-visible` styles for keyboard navigation (red outline)
- `::selection` themed text selection
- `@media (prefers-reduced-motion: reduce)` for accessibility
- Custom scrollbar styles
- Markdown content styling (`.md-content` class for rendered markdown)
- Shimmer and fade-in keyframe animations
- `touch-action: manipulation` on buttons (fixes mobile tap delay)
- `overscroll-behavior: none` on body (prevents bounce scroll)
- Font smoothing (`-webkit-font-smoothing`, `text-rendering`)

---

### Root Configuration Files

#### `index.html`

HTML entry point with SEO meta tags:
- Favicon (inline SVG with terminal icon)
- Viewport meta with `viewport-fit=cover` for safe areas
- Theme color (dark and light variants)
- Title and description
- Keywords and author
- Robots and Googlebot directives
- Canonical URL
- Open Graph tags (title, description, type, url, site_name, locale)
- Twitter Card tags
- JSON-LD structured data (SoftwareApplication schema)
- Root div and main script entry

#### `package.json`

Project dependencies and scripts:
- **Scripts**: dev, build, lint, lint:fix, typecheck, preview
- **Dependencies**: React 18, Vite 6, Base44 SDK, Tailwind CSS, shadcn/ui (Radix UI), Framer Motion, Lucide React, Recharts, React Markdown, React Hook Form, Zod, TanStack React Query, React Router DOM, Three.js, React Leaflet, @hello-pangea/dnd, date-fns, moment, and more
- **Dev Dependencies**: ESLint 9, TypeScript 5, Vite 6, Tailwind CSS 3, PostCSS, Autoprefixer

#### `vite.config.js`

Vite configuration with:
- `@base44/vite-plugin` — Enables Base44 features (HMR notifications, navigation tracking, analytics, visual editing, legacy SDK imports)
- `@vitejs/plugin-react` — React support for Vite

#### `tailwind.config.js`

Tailwind CSS configuration:
- Dark mode via `class` strategy
- Content paths: `./index.html`, `./src/**/*.{ts,tsx,js,jsx}`
- Extended theme: colors (mapped from CSS custom properties), fonts, border radius, chart colors, sidebar colors, animations
- Plugin: `tailwindcss-animate`

#### `postcss.config.js`

PostCSS configuration with Tailwind CSS and Autoprefixer plugins.

#### `jsconfig.json`

TypeScript configuration for JavaScript projects:
- Path alias: `@/*` → `./src/*`
- JSX: react-jsx
- Module: esnext
- `checkJs: true` for type checking
- Includes: `src/components/**/*.js`, `src/pages/**/*.jsx`, `src/Layout.jsx`
- Excludes: `node_modules`, `dist`, `src/components/ui`, `src/api`, `src/lib`

#### `eslint.config.js`

ESLint 9 flat configuration:
- Applies to: `src/components/**/*.{js,mjs,cjs,jsx}`, `src/pages/**/*.{js,mjs,cjs,jsx}`, `src/Layout.jsx`
- Ignores: `src/lib/**/*`, `src/components/ui/**/*`
- Plugins: @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-unused-imports
- Key rules: react-hooks/rules-of-hooks (error), unused-imports/no-unused-imports (error), react/prop-types (off), react/react-in-jsx-scope (off)

#### `components.json`

shadcn/ui configuration:
- Style: New York
- RSC: false (not React Server Components)
- TSX: false (uses .jsx, not .tsx)
- Base color: neutral
- CSS variables: true
- Icon library: Lucide
- Aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`

#### `.gitignore`

Git ignore rules for:
- `node_modules/`
- `dist/`
- `.env.local` and other environment files
- IDE files
- OS files
- Logs

#### `AGENTS.md`

Instructions for AI agents working on the project. Contains project context, Base44 references, key file locations, and working notes.

#### `CLAUDE.md`

Short file that points to `AGENTS.md` for instructions.

---

## File Count Summary

| Location | Count | Type |
|---|---|---|
| `base44/entities/` | 12 | JSON entity schemas |
| `src/components/chat/` | 10 | Chat components |
| `src/components/feedback/` | 2 | Feedback components |
| `src/components/landing/` | 8 | Landing page sections |
| `src/components/snippets/` | 2 | Snippet components |
| `src/components/ui/` | 60+ | shadcn/ui primitives + custom variants |
| `src/components/` (top-level) | 8 | App-level components |
| `src/hooks/` | 2 | Custom hooks |
| `src/lib/config/` | 6 | Configuration modules |
| `src/lib/` (other) | 6 | Library files |
| `src/pages/` | 25+ | Page components |
| `src/utils/` | 1 | Utility exports |
| Root config files | 10+ | Configuration files |
| Documentation files | 5 | Markdown documentation |