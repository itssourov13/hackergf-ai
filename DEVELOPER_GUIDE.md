# Developer Guide — Hacker gf

A practical guide for developers working on the Hacker gf project.

---

## Table of Contents

1. [How a Developer Should Start](#1-how-a-developer-should-start)
2. [Local Setup](#2-local-setup)
3. [Base44 Eject Workflow](#3-base44-eject-workflow)
4. [GitHub Workflow](#4-github-workflow)
5. [Local Development](#5-local-development)
6. [Environment Configuration](#6-environment-configuration)
7. [Deployment Checklist](#7-deployment-checklist)
8. [Coding Conventions](#8-coding-conventions)
9. [File Organization](#9-file-organization)
10. [Common Mistakes](#10-common-mistakes)
11. [Best Practices](#11-best-practices)

---

## 1. How a Developer Should Start

### Step 1: Read the Documentation

Start by reading these files in order:
1. `README.md` — Project overview, setup, and deployment
2. `PROJECT_DOCUMENTATION.md` — Complete technical architecture
3. `PROJECT_STRUCTURE.md` — Folder and file reference
4. `AGENTS.md` — AI agent working notes

### Step 2: Understand the Stack

This is a **React 18 + Vite 6** SPA with:
- **Tailwind CSS 3** for styling
- **shadcn/ui** (New York style) for component primitives
- **Base44 SDK** for backend (auth, database, AI, file storage)
- **React Router 6** for routing
- **TanStack React Query 5** for server state
- **Framer Motion** for animations
- **Lucide React** for icons

### Step 3: Understand the Architecture

- The **Base44 platform** is the backend — there is no custom server code.
- All data operations go through `base44.entities.{EntityName}.{operation}()`.
- All AI calls go through `base44.integrations.Core.InvokeLLM()`.
- Auth is managed by `src/lib/AuthContext.jsx` using the Base44 SDK.
- The app uses lazy loading for all authenticated pages.

### Step 4: Set Up Locally

Follow the [Local Setup](#2-local-setup) section below.

---

## 2. Local Setup

### Prerequisites

- **Node.js** 18+ (recommended 20+)
- **npm** 10+ (or yarn/pnpm)
- A **Base44 account** with an app created
- A code editor (VS Code recommended)
- Git

### Step-by-Step

```bash
# 1. Clone the repository
git clone <repository-url>
cd hacker-gf

# 2. Install dependencies
npm install

# 3. Create environment file
cat > .env.local << 'EOF'
VITE_BASE44_APP_ID=your_app_id_here
EOF

# 4. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Verify Setup

```bash
# Lint passes
npm run lint

# Type-check passes
npm run typecheck

# Build succeeds
npm run build
```

---

## 3. Base44 Eject Workflow

### What Does "Ejecting" Mean?

Ejecting means taking the project out of the Base44 Builder environment and running it as a standard Vite + React project. The project still depends on the Base44 SDK for backend functionality, but you have full control over the codebase.

### How to Eject

1. **Export from Base44 Builder**:
   - In the Base44 Builder dashboard, find the export/download option.
   - This gives you the full project source code.

2. **Or clone the repository** if you already have Git access.

3. **Set up environment**:
   ```bash
   npm install
   echo "VITE_BASE44_APP_ID=your_app_id" > .env.local
   ```

4. **Run locally**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

### Full Ejection (Removing Base44 Dependencies)

If you want to completely remove Base44 as a dependency, you need to replace:

| Base44 Feature | Replacement Needed |
|---|---|
| `base44.entities.*` | Your own REST/GraphQL API client |
| `base44.auth.*` | Your own auth solution (e.g., NextAuth, Auth0, custom JWT) |
| `base44.integrations.Core.InvokeLLM` | Direct API calls to OpenAI/Google/Anthropic |
| `base44.integrations.Core.UploadFile` | Your own file storage (e.g., S3, Cloudinary) |
| `base44.integrations.Core.ExtractDataFromUploadedFile` | Your own file parsing logic |
| `base44.analytics.track` | Your own analytics (e.g., PostHog, Mixpanel) |
| `@base44/vite-plugin` in `vite.config.js` | Remove the plugin from Vite config |
| `@base44/sdk` in `package.json` | Uninstall the package |

> **Warning**: Full ejection is a significant effort. Every `base44.*` call in the codebase must be replaced. This is not recommended unless you have a compelling reason to leave the Base44 platform.

---

## 4. GitHub Workflow

### Branch Strategy

```
main          ← Production-ready code
└── feature/* ← Feature branches
└── fix/*     ← Bug fix branches
└── chore/*   ← Maintenance branches
```

### Standard Workflow

```bash
# 1. Sync with main
git checkout main
git pull origin main

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make changes
# ... edit files ...

# 4. Run quality checks
npm run lint
npm run typecheck
npm run build

# 5. Stage and commit
git add .
git commit -m "feat: add new feature"

# 6. Push to remote
git push origin feature/your-feature-name

# 7. Create a pull request on GitHub
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use Case |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Code style (no logic change) |
| `refactor:` | Code refactoring |
| `test:` | Test additions |
| `chore:` | Build, deps, tooling |
| `ci:` | CI/CD changes |

Examples:
```
feat: add code snippet favorites toggle
fix: resolve chat sidebar not closing on mobile
docs: update deployment guide
chore: upgrade framer-motion to 11.16.4
```

### Pull Request Checklist

- [ ] Branch is up to date with `main`
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] Changes tested manually
- [ ] No secrets in code
- [ ] Commit messages follow convention
- [ ] PR description explains what and why

---

## 5. Local Development

### Dev Server

```bash
npm run dev
```

- Runs Vite dev server at `http://localhost:5173`
- Hot Module Replacement (HMR) provides instant feedback
- The Base44 Vite plugin adds HMR notifications and analytics tracking

### Making Changes

#### Editing a Page

1. Find the page in `src/pages/` (e.g., `Dashboard.jsx`).
2. Make your changes.
3. The browser updates instantly via HMR.

#### Adding a New Page

1. Create the page component:
   ```bash
   # src/pages/NewPage.jsx
   ```

2. Add a lazy import and route in `src/App.jsx`:
   ```javascript
   const NewPage = lazy(() => import('@/pages/NewPage'));
   // ... inside <Routes>
   <Route path="/new-page" element={<NewPage />} />
   ```

3. (Optional) Add navigation in `src/components/AppLayout.jsx`.

#### Adding a New Entity

1. Create the schema in `base44/entities/NewEntity.jsonc`.
2. Use it in components:
   ```javascript
   import { base44 } from '@/api/base44Client';
   const items = await base44.entities.NewEntity.list();
   ```

#### Adding a New Component

1. Create the component in `src/components/` (or a subfolder).
2. Keep components focused — 50 lines or less per file.
3. Export as default with the same name as the file.
4. Import using the `@/` alias.

### Quality Checks

Run these before committing:

```bash
npm run lint        # ESLint check
npm run lint:fix    # ESLint auto-fix
npm run typecheck   # TypeScript check
npm run build       # Production build test
```

### Debugging

- Check the **browser console** for JavaScript errors.
- Check the **Network tab** for failed API calls.
- Use **React DevTools** to inspect component state.
- Use **Base44 Builder logs** for backend errors.
- The `ErrorBoundary` component catches and displays unhandled errors.

---

## 6. Environment Configuration

### Environment Variables

| Variable | Description | Required | Default |
|---|---|---|---|
| `VITE_BASE44_APP_ID` | Base44 application ID | Yes | — |
| `VITE_BASE44_FUNCTIONS_VERSION` | Base44 functions version | No | — |
| `VITE_BASE44_APP_BASE_URL` | Base44 app base URL | No | — |

### Environment Files

| File | Purpose | Committed? |
|---|---|---|
| `.env` | Default environment (shared) | Yes |
| `.env.local` | Local overrides | **No** (in `.gitignore`) |
| `.env.production` | Production overrides | Yes |
| `.env.development` | Development overrides | Yes |

### Runtime Parameters

The app also reads parameters from the URL and localStorage (see `src/lib/app-params.js`):
- `?app_id=xxx` — Overrides app ID
- `?access_token=yyy` — Auth token (extracted and removed from URL)
- `?from_url=zzz` — Post-login redirect
- `?functions_version=www` — Functions version override
- `?app_base_url=vvv` — Base URL override
- `?clear_access_token=true` — Clears stored tokens

### Base44 Config

`base44/config.jsonc`:
```jsonc
{
  "name": "untitled",
  "site": {
    "installCommand": "npm install",
    "buildCommand": "npm run build",
    "serveCommand": "npm run dev",
    "outputDirectory": "./dist"
  }
}
```

---

## 7. Deployment Checklist

### Pre-Deployment

- [ ] All features tested manually
- [ ] `npm run lint` passes with no errors
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] `npm run preview` works correctly
- [ ] No secrets or API keys in code
- [ ] `.env.local` is in `.gitignore`

### Environment Variables

- [ ] `VITE_BASE44_APP_ID` is set on the hosting platform
- [ ] Any other required environment variables are set

### SEO

- [ ] `index.html` has correct title and meta description
- [ ] Open Graph tags are present
- [ ] Twitter Card tags are present
- [ ] Canonical URL is correct
- [ ] JSON-LD structured data is present
- [ ] `robots` meta tag is set

### Accessibility

- [ ] Focus-visible styles work for keyboard navigation
- [ ] All interactive elements have ARIA labels
- [ ] Images have alt text
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Reduced motion preferences are respected

### Performance

- [ ] Lazy-loaded routes work correctly
- [ ] Images are optimized
- [ ] No large dependencies in the main bundle
- [ ] Build output size is reasonable

### Post-Deployment

- [ ] App loads without errors
- [ ] Authentication works (login, register, logout)
- [ ] All routes are accessible
- [ ] API calls succeed
- [ ] Mobile responsiveness verified
- [ ] HTTPS is enabled
- [ ] SPA routing works (direct URL access to routes)

---

## 8. Coding Conventions

### General

- **Language**: JavaScript (JSX/TSX). Some config files use TypeScript (`.ts`).
- **ESM only**: Use `import/export`, never `require()/module.exports`.
- **File naming**: PascalCase for components (e.g., `ChatMessage.jsx`), kebab-case for UI primitives (e.g., `button-custom.jsx`), camelCase for utilities (e.g., `app-params.js`).
- **Component naming**: Component name matches file name. Default export.
- **Constants**: UPPER_SNAKE_CASE for constants (e.g., `PLANS`, `AI_MODELS`).

### Imports

- Use the `@/` alias for all imports (not relative paths):
  ```javascript
  // Good
  import { base44 } from '@/api/base44Client';
  import { Button } from '@/components/ui/button';

  // Bad
  import { base44 } from '../../api/base44Client';
  ```
- Group imports: external packages first, then internal modules.
- Import only what you need (tree-shaking).

### React

- Functional components only (no class components except `ErrorBoundary`).
- Hooks at the top level — never in conditionals, loops, or handlers.
- Use `useState` for local UI state.
- Use React Query for server state.
- Use React Context for shared state (e.g., auth).
- Every page/component gets its own file.
- Keep components small: 50 lines or less per file.

### Styling

- Use **Tailwind CSS** classes (literal strings, not dynamic concatenation).
- Use **shadcn/ui** components from `@/components/ui/`.
- Use design token classes (`bg-primary`, `font-heading`) — not hardcoded values.
- Custom colors go in `src/index.css` as CSS custom properties, mapped in `tailwind.config.js`.
- Icons from **lucide-react** only.
- Dark mode is the default; the app uses a dark hacker aesthetic with red accents.

### Entity Operations

- Always filter by `created_by_id` for user data isolation:
  ```javascript
  base44.entities.Chat.filter({ created_by_id: user.id }, '-created_date', 20);
  ```
- Use `bulkCreate` / `bulkUpdate` for multiple records.
- Let errors bubble up (no try/catch) unless it's a user-facing form flow.

### Naming

- **Components**: PascalCase (e.g., `ChatMessage`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `AI_MODELS`)
- **Files**: Match the export name (e.g., `ChatMessage.jsx` exports `ChatMessage`)
- **CSS classes**: kebab-case (Tailwind handles this)

### Comments

- Use JSDoc for component props and utility functions.
- Comment complex logic with `//` inline comments.
- Don't over-comment obvious code.

---

## 9. File Organization

### Where Things Go

| What | Where |
|---|---|
| Page components | `src/pages/` |
| Reusable components | `src/components/` or subfolder |
| shadcn/ui primitives | `src/components/ui/` |
| Custom hooks | `src/hooks/` |
| Auth/context providers | `src/lib/` |
| Configuration | `src/lib/config/` |
| Utility functions | `src/lib/` or `src/utils/` |
| API clients | `src/api/` |
| Entity schemas | `base44/entities/` |
| Static assets | `public/` |

### Component Subfolders

| Folder | Contents |
|---|---|
| `src/components/chat/` | Chat interface components |
| `src/components/feedback/` | Feedback portal components |
| `src/components/landing/` | Landing page sections |
| `src/components/snippets/` | Code snippet components |
| `src/components/ui/` | shadcn/ui primitives + custom variants |

### File Naming Patterns

| Pattern | Example | Used For |
|---|---|---|
| PascalCase | `ChatMessage.jsx` | Page and component files |
| kebab-case-custom | `button-custom.jsx` | Custom UI variants |
| kebab-case | `use-mobile.jsx` | Hooks |
| camelCase | `app-params.js` | Utility/lib files |
| PascalCase | `Chat.jsonc` | Entity schemas |

### Config File Pattern

Configuration files in `src/lib/config/` follow this pattern:
- TypeScript (`.ts`) for type safety
- Export typed interfaces
- Export a record/map of configurations
- Export helper functions (e.g., `getPlan()`, `hasPermission()`)

---

## 10. Common Mistakes

### 1. Using `require()` Instead of `import`

```javascript
// Bad — will break the Vite ESM build
const base44 = require('@/api/base44Client');

// Good
import { base44 } from '@/api/base44Client';
```

### 2. Using Relative Paths Instead of `@/` Alias

```javascript
// Bad — breaks on file moves
import { Button } from '../../components/ui/button';

// Good
import { Button } from '@/components/ui/button';
```

### 3. Importing `cn` from the Wrong Location

```javascript
// Bad
import { cn } from '@/utils';

// Good
import { cn } from '@/lib/utils';
```

### 4. Dynamic Tailwind Class Names

```javascript
// Bad — Tailwind purge won't find dynamically constructed class names
<div className={`bg-${color}-500`}>

// Good — use a literal mapping object
const colorMap = { red: 'bg-red-500', blue: 'bg-blue-500' };
<div className={colorMap[color]}>
```

### 5. Importing Icons That Don't Exist in Lucide

Always verify that an icon exists at [lucide.dev](https://lucide.dev) before importing it. Importing a non-existent icon from `lucide-react` will break the entire application build. If you're unsure, search the Lucide icon library first.

```javascript
// Good — verify the icon exists before importing
import { Terminal, MessageSquare, Code2 } from 'lucide-react';
```

### 6. Importing from the Wrong shadcn/ui File

Each shadcn/ui file exports only its own primitives. One UI file never re-exports another.

```javascript
// Bad — shadcn files don't re-export other primitives
import { Button, Label } from '@/components/ui/button';

// Good — import each from its own file
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
```

### 7. Conditional Hook Calls

```javascript
// Bad — violates rules of hooks
if (condition) {
  const [state, setState] = useState(null);
}

// Good — hooks at the top level
const [state, setState] = useState(condition ? initialValue : null);
```

### 8. Not Filtering by `created_by_id`

```javascript
// Bad — returns all records (security issue)
const chats = await base44.entities.Chat.list();

// Good — only returns the current user's chats
const chats = await base44.entities.Chat.filter({ created_by_id: user.id });
```

### 9. Using `navigate()` for Auth Redirects

```javascript
// Bad — auth provider doesn't re-initialize
navigate('/login');

// Good — hard redirect forces re-initialization
window.location.href = '/login';
```

### 10. Creating User Records via SDK

```javascript
// Bad — returns 405
await base44.entities.User.create({ email: 'user@example.com' });

// Good — invite users instead
await base44.users.inviteUser('user@example.com', 'user');
```

### 11. Writing JSX in `.js` Files

JSX only works in `.jsx` or `.tsx` files. Never write JSX syntax in a `.js` file — the build will fail.

```javascript
// Bad — JSX in a .js file will not compile
// src/lib/component.js
export default function MyComponent() {
  return <div>Hello</div>;
}

// Good — use .jsx extension
// src/components/MyComponent.jsx
```

### 12. Putting Extra Content in `<Routes>`

```javascript
// Bad — React Router crashes on non-Route children inside <Routes>
<Routes>
  <SomeComponent />
  <Route path="/" element={<Home />} />
</Routes>

// Good — only Route elements inside Routes
<Routes>
  <Route path="/" element={<Home />} />
</Routes>
```

---

## 11. Best Practices

### Performance

- **Lazy load pages**: Use `React.lazy()` + `Suspense` for all non-critical routes.
- **Memoize expensive computations**: Use `useMemo` for derived data.
- **Memoize callbacks**: Use `useCallback` for functions passed as props.
- **Avoid unnecessary re-renders**: Keep state local where possible.
- **Use React Query for server state**: Don't manually manage fetched data.
- **Use bulk operations**: `bulkCreate` / `bulkUpdate` over loops of single operations.

### Accessibility

- **Use semantic HTML**: `<button>` for buttons, `<nav>` for navigation, `<main>` for content.
- **Add ARIA labels**: For icon-only buttons and interactive elements.
- **Ensure keyboard navigation**: All interactive elements should be reachable via Tab.
- **Test focus-visible**: The app has global `:focus-visible` styles — make sure they work.
- **Respect reduced motion**: The app has `prefers-reduced-motion` support — don't override it.
- **Color contrast**: Ensure text meets WCAG 2.1 AA contrast ratios.

### Security

- **Filter by `created_by_id`**: Always scope entity queries to the current user.
- **Never commit secrets**: Use `.env.local` (gitignored) for local secrets.
- **Validate inputs**: Use React Hook Form + Zod for form validation.
- **Use the ErrorBoundary**: Let it catch unhandled errors.
- **Don't store large data in entities**: Use file URLs for large content.
- **Check admin role**: Verify `user.role === 'admin'` before showing admin features.

### Code Quality

- **Keep files small**: 50 lines or less per component.
- **Single responsibility**: One component per file, one purpose per function.
- **Consistent naming**: Follow the conventions in Section 8.
- **No unused imports**: ESLint enforces this (`unused-imports/no-unused-imports`).
- **Run lint before commit**: `npm run lint` should always pass.
- **Run typecheck**: `npm run typecheck` catches type errors in `.ts` files.

### Base44 SDK Usage

- **Use the pre-initialized client**: Import from `@/api/base44Client`.
- **Don't create a new client**: The client is already configured with app params.
- **Use real-time subscriptions**: For live updates, use `entity.subscribe()`.
- **Track analytics**: Use `base44.analytics.track()` for custom events.
- **Track usage**: Use `trackUsage()` from `src/lib/usage.js` for usage metrics.

### UI / UX

- **Use design tokens**: `bg-primary`, `text-foreground`, `font-heading` — not hardcoded values.
- **Use shadcn/ui components**: Don't reinvent buttons, inputs, dialogs, etc.
- **Loading states**: Always show loading indicators during async operations.
- **Empty states**: Always show empty state messages when there's no data.
- **Error states**: Always show user-friendly error messages.
- **Mobile-first**: Design for mobile, then enhance for desktop.
- **Touch targets**: Minimum 44x44px for interactive elements on mobile.
- **Smooth transitions**: Use Framer Motion for animations, CSS transitions for simple effects.