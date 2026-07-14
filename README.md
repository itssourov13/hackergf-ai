# HackerAI

A production-ready AI SaaS platform for developers. Chat with AI, write code, execute programs, and manage files — all in one hacker-themed interface.

## Tech Stack

- **React** + **Vite** — Frontend framework
- **Tailwind CSS** — Styling
- **Base44** — Backend-as-a-Service (auth, database, AI integrations, file storage, analytics)
- **React Router** — Routing
- **React Markdown** — Markdown rendering
- **Lucide React** — Icons

## Features

### Phase 0 — Foundation
- Project structure with modular configuration
- Centralized config files for plans, roles, upload limits, feature flags, AI models, and app constants
- TypeScript-ready configuration modules

### Phase 1 — UI Foundation
- Dark hacker aesthetic with red accent color
- Sticky responsive navbar with mobile menu
- Landing page with Hero, Features, How It Works, Technology, Pricing, and FAQ sections
- Reusable UI components: Button, Card, Container, Section, Badge
- Smooth scrolling and fade-in animations
- Fully responsive (mobile-first)

### Phase 2 — Authentication
- Sign In / Sign Up / Forgot Password / Reset Password pages (built-in)
- Session management via Base44 Auth
- Protected routes with automatic redirect to login
- Google OAuth support
- User menu in app sidebar

### Phase 3 — Database
- **Chat** — AI conversation records
- **Message** — Individual chat messages (user/assistant/system)
- **Project** — Code projects with files
- **File** — Uploaded files with extracted content
- **Subscription** — Billing and usage tracking
- **Settings** — User preferences
- **UsageRecord** — Usage metrics tracking
- **ApiKey** — API key management

### Phase 4 — AI Chat System
- Real-time AI chat with streaming-style loading
- Multiple AI model support (GPT-5, Gemini, Claude)
- Conversation sidebar with create/delete/switch
- Markdown rendering with syntax highlighting
- Copy message button
- Model selector with premium badges
- Suggested prompts for empty state
- Auto-scroll and typing indicator
- Error recovery

### Phase 5 — Code Editor
- Multi-tab code editor with file management
- Create/rename/delete files
- Unsaved changes indicator
- Save to database (auto-save ready)
- Language support: JavaScript, TypeScript, Python, HTML, CSS, JSON, Markdown, Bash
- Integrated terminal with simulated JavaScript execution
- Run code and view output
- Dark hacker theme

### Phase 7 — File Upload & Document Processing
- Drag & drop upload with file picker
- Multiple file upload support
- File type validation and size limits
- Content extraction (PDF, DOCX, TXT, code files)
- File manager with search, preview, and metadata
- Configurable upload limits per file type
- Word count, character count, page count

### Phase 9 — Billing & Roles (Configuration)
- Configurable subscription plans (Free, Pro, Team, Enterprise)
- Role system (Guest, User, Pro, Team, Admin)
- Feature flag system with plan-based access
- Admin override configuration
- Usage tracking infrastructure

## Project Structure

```
src/
├── components/
│   ├── landing/          # Landing page sections
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── HowItWorksSection.jsx
│   │   ├── TechStackSection.jsx
│   │   ├── PricingSection.jsx
│   │   └── FAQSection.jsx
│   ├── ui/               # Reusable UI components
│   │   ├── button-custom.jsx
│   │   ├── card-custom.jsx
│   │   ├── badge-custom.jsx
│   │   ├── container.jsx
│   │   └── section.jsx
│   ├── AppLayout.jsx     # Authenticated app layout with sidebar
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── Dashboard.jsx     # App dashboard
│   ├── ChatPage.jsx      # AI chat interface
│   ├── EditorPage.jsx    # Code editor
│   ├── FilesPage.jsx     # File manager
│   ├── SettingsPage.jsx  # User settings
│   ├── Login.jsx         # Auth (built-in)
│   ├── Register.jsx      # Auth (built-in)
│   ├── ForgotPassword.jsx
│   └── ResetPassword.jsx
├── lib/
│   └── config/           # Centralized configuration
│       ├── plans.ts      # Subscription plans
│       ├── roles.ts      # User roles & permissions
│       ├── uploadLimits.ts
│       ├── featureFlags.ts
│       ├── aiProviders.ts
│       └── constants.ts  # App constants
└── App.jsx               # Router

base44/
└── entities/             # Database schemas
    ├── Chat.jsonc
    ├── Message.jsonc
    ├── Project.jsonc
    ├── File.jsonc
    ├── Subscription.jsonc
    ├── Settings.jsonc
    ├── UsageRecord.jsonc
    └── ApiKey.jsonc
```

## Environment Variables

The following environment variables are managed by the Base44 platform:
- Authentication tokens
- Database connection
- AI model API keys (via Base44 integrations)
- File storage (via Base44 UploadFile)

## Local Development

The project runs on the Base44 platform. All changes are reflected in real-time in the preview.

## Deployment

The app is deployed via the Base44 platform and is compatible with Vercel deployment.

## License

© HackerAI. All rights reserved.