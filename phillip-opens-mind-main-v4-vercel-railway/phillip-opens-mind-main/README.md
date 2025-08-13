# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a01a114e-ca71-4e59-b45e-e70f3319b9d8

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a01a114e-ca71-4e59-b45e-e70f3319b9d8) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a01a114e-ca71-4e59-b45e-e70f3319b9d8) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Backend (Express + OpenAI)

A minimal API server is included under `/server` to provide real model responses.

### Setup
1. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
2. Install deps:
   ```bash
   npm install
   ```
3. Run the web + API together:
   ```bash
   npm run dev:full
   ```
   - Web: Vite dev server (default)
   - API: http://localhost:8787

### Production
- Deploy the frontend as before.
- Deploy the API (e.g., Fly.io, Render, Railway, Vercel functions, or a small VPS), and set the frontend to call the deployed API URL.

## New Features (Aug 2025)
- **Streaming chat** via `/api/chat/stream` (SSE).
- **PHQ‑9 & GAD‑7 intake** with automatic scoring and summary (`/intake`).
- **Credits & Stripe checkout** (`/billing`) with webhook to increment credits.
- **PHI scrubbing** (emails/phones/SSNs/addresses) server-side before model calls.
- **Audit logs** written to `audit.log`.
- **Model selection** in the Chat toolbar; provider abstraction ready for more.

### Local Dev
```bash
cp .env.example .env
# fill out OPENAI_API_KEY; optionally Stripe vars
npm install
npm run dev:full
# Frontend: http://localhost:5173  •  API: http://localhost:8787
```
Make sure your Vite dev server proxies `/api/*` to `http://localhost:8787` or run both locally and rely on relative path in the browser.

### Deployment
- **Frontend**: Vercel/Netlify/Static hosting from `dist` (if using `vite build`).
- **API**: Fly.io / Render / Railway / VPS. Set env vars from `.env.example`. Expose `/api/*`.
- **Stripe**: Point the webhook to `/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET`.

## Deployment Guide

### Frontend (Vercel)
1. Push this repo to GitHub.
2. In Vercel → New Project → Import repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output dir: `dist`.
4. ENV (Project → Settings → Environment Variables):
   - `VITE_API_BASE_URL` = your API URL (e.g., https://api.yourapp.com)
5. Redeploy. The app will call `${import.meta.env.VITE_API_BASE_URL}/api/chat`.

### Backend API (Railway/Render/Fly)
- **Railway (quick):**
  1. Create a new service from repo root.
  2. Start command: `npm run server` (uses `tsx server/index.ts`).
  3. Set ENV:
     - `OPENAI_API_KEY`
     - `OPENAI_MODEL` (optional)
     - `PORT` (Railway sets this automatically; our server uses it).
     - `CORS_ORIGIN` (optional; if set, restrict to your web origin)
  4. Copy the public URL and set it as `VITE_API_BASE_URL` in Vercel.
- **Render/Fly** are similar: set the same ENV; expose port.

### Stripe Webhook (optional billing)
- In Stripe → Developers → Webhooks, point to `https://YOUR_API/api/stripe/webhook`.
- Put the secret as `STRIPE_WEBHOOK_SECRET` in your API env.
- Keep test mode until you’re ready.

### Security Notes
- Never commit `.env` with secrets.
- If handling PHI, configure data retention, encryption at rest, access logs, and sign BAAs with vendors (e.g., OpenAI BAA if needed).

## Deploy: Vercel (web) + Railway (API)

### Vercel (Frontend)
1. Push this repo to GitHub.
2. On Vercel → New Project → Import repo.
3. Environment Variables:
   - `VITE_API_BASE_URL` = `https://<your-railway-service>.up.railway.app`
4. Build & Output:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy.

### Railway (API)
1. Create a new Node service from this repo or a separate `server`-only repo.
2. Set Railway Environment Variables:
   - `OPENAI_API_KEY` = your key
   - `OPENAI_MODEL` (optional)
   - `CORS_ORIGIN` = `https://<your-vercel-domain>.vercel.app`
3. Set Start Command: `npm run start`
   - Railway will run `npm install`, then `npm run build`, then `npm run start`.
4. After deploy, copy the public URL and paste it into Vercel as `VITE_API_BASE_URL`.

### Local quick test
- API: `npm run server` (dev) or `npm run build && npm start` (prod)
- Web: `npm run dev` (dev) or serve `dist` (prod)
- Health check: GET `/health` on your API should return `{ ok: true }`.
