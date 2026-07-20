# Deployment Guide — Hacker gf

Step-by-step instructions for deploying the Hacker gf application to various platforms.

---

## Table of Contents

1. [How to Download / Eject from Base44](#1-how-to-download--eject-from-base44)
2. [Required Software](#2-required-software)
3. [npm install](#3-npm-install)
4. [npm run dev](#4-npm-run-dev)
5. [npm run build](#5-npm-run-build)
6. [Environment Variables](#6-environment-variables)
7. [Deploying to Vercel](#7-deploying-to-vercel)
8. [Deploying to Netlify](#8-deploying-to-netlify)
9. [Deploying to Cloudflare Pages](#9-deploying-to-cloudflare-pages)
10. [Deploying to a VPS Using Nginx](#10-deploying-to-a-vps-using-nginx)
11. [Common Deployment Errors](#11-common-deployment-errors)
12. [How to Verify Deployment](#12-how-to-verify-deployment)

---

## 1. How to Download / Eject from Base44

### Option A: Export from Base44 Builder

1. Log in to the [Base44 platform](https://base44.com).
2. Open your app in the Base44 Builder.
3. Find the export/download option in the Builder dashboard.
4. Download the project as a ZIP archive.
5. Extract the ZIP to your desired location.

### Option B: Clone from Git

If your project is connected to a Git repository:

```bash
git clone <repository-url>
cd hacker-gf
```

### Option C: Download Source

If you have a direct download link:

```bash
curl -L -o hacker-gf.zip <download-url>
unzip hacker-gf.zip
cd hacker-gf
```

### What You Get

The downloaded project contains:
- Full React + Vite frontend source code
- Base44 entity schemas (`base44/entities/`)
- Configuration files (`vite.config.js`, `tailwind.config.js`, etc.)
- The Base44 SDK client (`src/api/base44Client.js`)
- The Base44 Vite plugin (`@base44/vite-plugin`)

> **Note**: The project still depends on the Base44 platform for backend functionality (auth, database, AI, file storage). Full ejection (removing all Base44 dependencies) requires replacing all `base44.*` calls with your own backend — see `DEVELOPER_GUIDE.md` for details.

---

## 2. Required Software

### Required

| Software | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ (recommended 20+) | JavaScript runtime |
| **npm** | 10+ | Package manager (bundled with Node.js) |
| **Git** | 2.x+ | Version control (for cloning) |

### Optional

| Software | Version | Purpose |
|---|---|---|
| **Base44 CLI** | latest | Local Base44 backend (`base44 dev`) |
| **Vercel CLI** | latest | Deploying to Vercel |
| **Netlify CLI** | latest | Deploying to Netlify |
| **Wrangler** | latest | Deploying to Cloudflare Pages |
| **Nginx** | 1.18+ | VPS deployment |
| **PM2** | latest | Process management (VPS) |

### Check Your Setup

```bash
# Check Node.js
node --version    # Should be v18+

# Check npm
npm --version     # Should be 10+

# Check Git
git --version     # Should be 2.x+
```

---

## 3. npm install

After downloading/cloning the project, install dependencies:

```bash
cd hacker-gf
npm install
```

This installs all dependencies listed in `package.json`, including:
- React 18, React DOM
- Vite 6 and the Vite React plugin
- The Base44 SDK (`@base44/sdk`) and Vite plugin (`@base44/vite-plugin`)
- Tailwind CSS 3 and PostCSS
- shadcn/ui dependencies (Radix UI primitives)
- Framer Motion, Lucide React, Recharts, React Markdown, etc.

### Install Verification

```bash
# Check for vulnerabilities (optional)
npm audit

# Verify the dev server starts
npm run dev
```

### Troubleshooting npm install

**Error: `npm ERR! ERESOLVE` (dependency conflict)**
```bash
npm install --legacy-peer-deps
```

**Error: Node.js version mismatch**
```bash
# Install nvm and use the correct version
nvm install 20
nvm use 20
npm install
```

**Error: Permission denied**
```bash
# Use npx or fix permissions
sudo chown -R $USER ~/.npm
npm install
```

---

## 4. npm run dev

Start the development server:

```bash
npm run dev
```

This runs the Vite dev server with:
- Hot Module Replacement (HMR)
- The Base44 Vite plugin (HMR notifications, analytics, visual editing)
- React Fast Refresh

### Access the App

Open `http://localhost:5173` in your browser.

### Alternative: Full Local Backend

If you need the local Base44 backend:

```bash
base44 dev
```

This runs both the backend and frontend together. See the [Base44 CLI documentation](https://docs.base44.com/developers/references/cli/get-started/overview.md) for setup.

### Dev Server Configuration

The dev server runs on port 5173 by default (Vite's default). To change the port:

```bash
npm run dev -- --port 3000
```

---

## 5. npm run build

Create a production build:

```bash
npm run build
```

This:
1. Runs Vite's production build
2. Outputs static files to `./dist/`
3. Code-splits lazy-loaded routes into separate chunks
4. Tree-shakes unused CSS (Tailwind purge)
5. Minifies JavaScript and CSS

### Build Output

```
dist/
├── index.html              # Entry HTML
├── assets/
│   ├── index-[hash].js     # Main JavaScript bundle
│   ├── index-[hash].css    # Main CSS bundle
│   ├── vendor-[hash].js    # Vendor chunks
│   ├── Dashboard-[hash].js # Lazy-loaded page chunks
│   ├── ChatPage-[hash].js
│   └── ...                 # Other lazy chunks
└── ...                     # Other assets
```

### Pre-Build Checks

Run these before building for production:

```bash
# Lint
npm run lint

# Type-check
npm run typecheck

# Build
npm run build
```

### Preview the Build

Test the production build locally:

```bash
npm run preview
```

This serves the `./dist/` folder on a local server (typically `http://localhost:4173`).

---

## 6. Environment Variables

### Required Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_BASE44_APP_ID` | Your Base44 application ID | **Yes** |
| `VITE_BASE44_FUNCTIONS_VERSION` | Base44 functions version | No |
| `VITE_BASE44_APP_BASE_URL` | Base44 app base URL | No |

### Local Development

Create a `.env.local` file in the project root:

```env
VITE_BASE44_APP_ID=your_app_id_here
VITE_BASE44_FUNCTIONS_VERSION=
VITE_BASE44_APP_BASE_URL=
```

> **Important**: Never commit `.env.local` to Git. It's in `.gitignore`.

### Production Deployment

Set environment variables on your hosting platform (see platform-specific instructions below).

### How Variables Are Used

The app reads environment variables via `src/lib/app-params.js`:
1. URL query parameters (highest priority)
2. localStorage (persisted from URL)
3. Vite environment variables (`import.meta.env.VITE_*`)
4. Fallback to `null`

### Finding Your App ID

Your Base44 app ID is available in the Base44 Builder dashboard. It's typically a UUID string.

---

## 7. Deploying to Vercel

### Option A: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy** (from the project root):
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Project name: `hacker-gf` (or your preferred name)
   - Framework: **Vite** (auto-detected)
   - Build command: `npm run build` (auto-detected)
   - Output directory: `dist` (auto-detected)
   - Install command: `npm install` (auto-detected)

5. **Set environment variables**:
   ```bash
   vercel env add VITE_BASE44_APP_ID
   # Enter your app ID when prompted
   ```

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option B: Vercel Dashboard (Git Integration)

1. Push your code to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **Add New → Project**.
4. Import your Git repository.
5. Vercel auto-detects Vite. Verify:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
6. Add environment variables:
   - `VITE_BASE44_APP_ID` = your app ID
7. Click **Deploy**.
8. Vercel builds and deploys automatically. Future Git pushes trigger automatic deployments.

### Vercel SPA Routing

Vercel automatically handles SPA routing for Vite projects. No additional configuration needed.

### Vercel Custom Domain

1. Go to your project settings in Vercel.
2. Navigate to **Domains**.
3. Add your custom domain and follow the DNS instructions.

---

## 8. Deploying to Netlify

### Option A: Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Initialize** (from project root):
   ```bash
   netlify init
   ```

4. **Follow the prompts**:
   - Site name: `hacker-gf` (or your preferred name)
   - Build command: `npm run build`
   - Directory: `dist`

5. **Set environment variables**:
   ```bash
   netlify env:set VITE_BASE44_APP_ID your_app_id_here
   ```

6. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Option B: Netlify Dashboard (Git Integration)

1. Push your code to GitHub/GitLab/Bitbucket.
2. Go to [netlify.com](https://netlify.com) and log in.
3. Click **Add new site → Import an existing project**.
4. Connect your Git provider and select your repository.
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables:
   - Go to **Site settings → Environment variables**
   - Add `VITE_BASE44_APP_ID` = your app ID
7. Click **Deploy site**.

### Netlify SPA Routing

Create a `netlify.toml` file in the project root (or `_redirects` in `public/`):

**Option 1: `netlify.toml`**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Option 2: `public/_redirects`**
```
/*    /index.html   200
```

> **Important**: Without SPA routing configuration, direct URL access to routes like `/dashboard` will return 404.

### Netlify Custom Domain

1. Go to **Domain settings** in your Netlify site.
2. Click **Add a domain**.
3. Follow the DNS configuration instructions.

---

## 9. Deploying to Cloudflare Pages

### Option A: Wrangler CLI

1. **Install Wrangler**:
   ```bash
   npm i -g wrangler
   ```

2. **Login**:
   ```bash
   wrangler login
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Deploy**:
   ```bash
   wrangler pages deploy dist --project-name hacker-gf
   ```

5. **Set environment variables** (in Cloudflare dashboard):
   - Go to your project → **Settings → Environment variables**
   - Add `VITE_BASE44_APP_ID` = your app ID
   - Rebuild after setting variables

### Option B: Cloudflare Dashboard (Git Integration)

1. Push your code to GitHub/GitLab.
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com) and log in.
3. Click **Create a project → Connect to Git**.
4. Select your repository.
5. Configure build settings:
   - Framework preset: **None** (or Vite if available)
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Add environment variables:
   - `VITE_BASE44_APP_ID` = your app ID
7. Click **Save and Deploy**.

### Cloudflare SPA Routing

Create a `public/_redirects` file:

```
/*    /index.html   200
```

This file is copied to the build output and configures Cloudflare's SPA redirect behavior.

### Cloudflare Custom Domain

1. Go to your project → **Custom domains**.
2. Click **Set up a custom domain**.
3. Follow the DNS instructions (Cloudflare manages DNS if your domain is on Cloudflare).

---

## 10. Deploying to a VPS Using Nginx

### Step 1: Prepare the Server

```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt-get install -y nginx

# Verify
node --version
npm --version
nginx -v
```

### Step 2: Clone and Build

```bash
# Clone the project
git clone <repository-url> /var/www/hacker-gf
cd /var/www/hacker-gf

# Install dependencies
npm install

# Set environment variables
export VITE_BASE44_APP_ID=your_app_id_here

# Build
npm run build
```

### Step 3: Configure Nginx

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/hacker-gf
```

Add the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name your-domain.com;

    root /var/www/hacker-gf/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    gzip_comp_level 6;

    # SPA routing — redirect all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Don't cache index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

### Step 4: Enable the Site

```bash
# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/hacker-gf /etc/nginx/sites-enabled/

# Test the configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Set Up SSL (HTTPS) with Certbot

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Follow the prompts
# Certbot automatically configures Nginx for HTTPS
```

### Step 6: Set Up Auto-Deployment (Optional)

Create a deployment script:

```bash
sudo nano /var/www/hacker-gf/deploy.sh
```

```bash
#!/bin/bash
set -e

cd /var/www/hacker-gf

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Building..."
export VITE_BASE44_APP_ID=your_app_id_here
npm run build

echo "Deployment complete!"
```

```bash
# Make executable
sudo chmod +x /var/www/hacker-gf/deploy.sh
```

### Step 7: Update and Redeploy

```bash
# To update the app:
cd /var/www/hacker-gf
./deploy.sh
```

### Alternative: PM2 for Process Management

If you need to serve the app with a Node.js server instead of Nginx:

```bash
# Install PM2
sudo npm i -g pm2

# Create a simple server
cat > /var/www/hacker-gf/server.js << 'EOF'
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { extname } from 'path';

const PORT = 3000;
const DIST = './dist';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  let filePath = DIST + req.url;
  if (req.url === '/' || !extname(req.url)) filePath = DIST + '/index.html';
  
  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'text/plain' });
    res.end(content);
  } catch {
    const content = readFileSync(DIST + '/index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
EOF

# Start with PM2
pm2 start server.js --name hacker-gf
pm2 save
pm2 startup
```

---

## 11. Common Deployment Errors

### Error: Blank White Screen

**Cause**: SPA routing not configured, or JavaScript errors.

**Fix**:
1. Check browser console for errors.
2. Ensure SPA redirects are configured (see platform-specific sections).
3. Verify `VITE_BASE44_APP_ID` is set.
4. Check that all assets loaded (Network tab).

### Error: 404 on Direct Route Access (e.g., `/dashboard`)

**Cause**: SPA routing not configured. The server returns 404 for routes that don't match physical files.

**Fix**:
- **Vercel**: Automatically handled.
- **Netlify**: Add `public/_redirects` with `/* /index.html 200`.
- **Cloudflare**: Add `public/_redirects` with `/* /index.html 200`.
- **Nginx**: Add `try_files $uri $uri/ /index.html;` in the location block.

### Error: `VITE_BASE44_APP_ID is not defined`

**Cause**: Environment variable not set on the hosting platform.

**Fix**:
1. Set `VITE_BASE44_APP_ID` in your hosting platform's environment variables.
2. Trigger a rebuild (environment variables are baked at build time).

### Error: Build Fails with `Cannot resolve '@/...'`

**Cause**: The `@/` path alias is not configured.

**Fix**:
1. Verify `jsconfig.json` has the `@/*` path mapping.
2. Verify `vite.config.js` doesn't override resolve aliases.
3. Ensure all imports use `@/` and not relative paths.

### Error: `Module not found: Can't resolve '@base44/sdk'`

**Cause**: Dependencies not installed.

**Fix**:
```bash
npm install
```

### Error: CSS Not Loading

**Cause**: Tailwind CSS not processing or content paths wrong.

**Fix**:
1. Verify `tailwind.config.js` content paths include `./src/**/*.{ts,tsx,js,jsx}`.
2. Verify `postcss.config.js` has Tailwind CSS plugin.
3. Run `npm run build` and check for CSS in the output.

### Error: Lazy-Loaded Pages Don't Load

**Cause**: JavaScript chunks fail to load (wrong base URL).

**Fix**:
1. If deploying to a subdirectory, set `base` in `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/your-subdirectory/',
     // ...
   });
   ```
2. Check Network tab for 404s on chunk files.

### Error: Authentication Redirect Loop

**Cause**: Auth callback URL mismatch or token handling issue.

**Fix**:
1. Verify the Base44 app's callback URL includes your domain.
2. Clear browser localStorage and try again.
3. Check that `VITE_BASE44_APP_ID` is correct.

### Error: `ERR_TOO_MANY_REDIRECTS`

**Cause**: Redirect loop in SPA routing configuration.

**Fix**:
1. Ensure the redirect rule sends to `/index.html` with status 200 (not 301/302).
2. For Nginx, use `try_files` instead of `rewrite`.

### Error: Build Succeeds but App Doesn't Work

**Cause**: Runtime errors not caught during build.

**Fix**:
1. Run `npm run preview` locally and test.
2. Check browser console for runtime errors.
3. Verify all environment variables are set.
4. Test with the Base44 backend accessible.

---

## 12. How to Verify Deployment

### Step 1: Basic Load Test

1. Open your deployment URL in a browser.
2. Verify the landing page loads without errors.
3. Open browser DevTools → Console — check for errors.

### Step 2: SPA Routing Test

1. Navigate to a route directly (e.g., `https://your-domain.com/login`).
2. Verify the page loads (not a 404).
3. Navigate between routes using in-app links.
4. Refresh the page on any route — it should load correctly.

### Step 3: Authentication Test

1. Try logging in with valid credentials.
2. Try registering a new account.
3. Try the "Forgot Password" flow.
4. Log out and verify you're redirected to login.
5. Try accessing a protected route while logged out — verify redirect to login.

### Step 4: Feature Test

1. **AI Chat**: Create a new chat, send a message, verify AI response.
2. **Code Editor**: Create a project, add a file, run JavaScript code.
3. **File Upload**: Upload a file, verify it appears in the file manager.
4. **Settings**: Change settings and verify they persist.

### Step 5: Mobile Test

1. Open the app on a mobile device or use DevTools mobile emulation.
2. Verify the sidebar opens/closes correctly.
3. Verify all touch targets are at least 44×44px.
4. Test scrolling and navigation.

### Step 6: Performance Test

1. Run [Lighthouse](https://developers.google.com/web/tools/lighthouse) audit.
2. Check Core Web Vitals: LCP, CLS, INP.
3. Verify lazy-loaded chunks load on navigation.

### Step 7: SEO Test

1. View page source — verify meta tags are present.
2. Check Open Graph tags with [opengraph.xyz](https://www.opengraph.xyz/).
3. Test structured data with [Google's Rich Results Test](https://search.google.com/test/rich-results).
4. Verify canonical URL is correct.

### Step 8: Accessibility Test

1. Navigate using only keyboard (Tab, Enter, Escape).
2. Verify focus-visible outlines appear.
3. Test with a screen reader.
4. Check color contrast with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

### Step 9: HTTPS Test

1. Verify HTTPS is enabled (lock icon in browser).
2. Check that HTTP redirects to HTTPS.
3. Verify SSL certificate is valid.

### Step 10: Monitor

1. Set up uptime monitoring (e.g., UptimeRobot).
2. Monitor Base44 platform status.
3. Check error logs periodically.