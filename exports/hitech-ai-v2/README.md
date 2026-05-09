# HiTech AI — Hostinger Deployment Guide

## The problem with GitHub deployment (and the fix)

Hostinger's GitHub auto-deploy runs `npm install` in your repo root.
This package is designed specifically so that one `npm install` automatically
installs ALL dependencies (server + client) and builds the entire app.

---

## Option A — Deploy via GitHub (recommended)

### 1. Create a new GitHub repository

Create a **brand new** repo (e.g. `hitech-ai-app`) — do NOT push the
Replit project repo. Only the contents of this ZIP go into the new repo.

```bash
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/yourusername/hitech-ai-app.git
git push -u origin main
```

### 2. Connect to Hostinger

In hPanel → **Node.js** → **Create Application**:

| Setting | Value |
|---------|-------|
| Node.js version | 20.x or 22.x |
| Application root | `/home/username/hitech-ai-app` (where git clones to) |
| Application startup file | `dist/src/index.js` |
| Application URL | Your domain |

### 3. Set environment variables

In hPanel → Node.js → your app → **Environment Variables**, add:

```
NODE_ENV          = production
PORT              = 3000
DATABASE_URL      = postgresql://user:pass@host:5432/dbname
ADMIN_PASSWORD    = YourSecurePassword
SESSION_SECRET    = (40+ random characters)
N8N_WEBHOOK_URL   = https://your-n8n.com/webhook/xxx
CLIENT_URL        = https://yourdomain.com
```

### 4. Deploy

Click **Deploy** in Hostinger. It will:
1. Clone your GitHub repo
2. Run `npm install` → this automatically installs client deps and builds the frontend
3. Run `npm run build` → compiles the server TypeScript
4. Start `dist/src/index.js`

That's it. Your site is live.

---

## Option B — Upload ZIP via File Manager

If you prefer not to use GitHub:

1. Extract this ZIP on your computer
2. In hPanel → **File Manager**, upload the extracted folder
3. Open **SSH Terminal** in hPanel and run:

```bash
cd ~/public_html   # or wherever you uploaded
npm install        # installs everything + builds frontend automatically
npm run build      # builds the server
```

4. In hPanel → Node.js, set startup file to `dist/src/index.js` and click Start.

---

## Set up the database

In hPanel → **Databases → PostgreSQL**, create a database then connect with pgAdmin:

1. Download pgAdmin (free): pgadmin.org
2. Connect using your Hostinger DB credentials
3. Right-click your database → Query Tool
4. Paste the contents of `database/schema.sql` → Run
5. Optionally paste `database/seed.sql` for demo data

---

## Admin Dashboard

URL: `https://yourdomain.com/admin`
Password: whatever you set as `ADMIN_PASSWORD`

---

## Commands reference

| Command | What it does |
|---------|-------------|
| `npm install` | Installs server deps + auto-builds frontend |
| `npm run build` | Compiles server TypeScript → `dist/src/index.js` |
| `npm start` | Starts the production server |
| `npm run dev` | Starts dev server with hot reload |
| `npm run db:push` | Pushes DB schema changes (alternative to SQL file) |

---

## Troubleshooting

**Build fails on Hostinger:**
- Make sure Node.js version is set to 20.x or 22.x in hPanel
- Check build logs in hPanel → Node.js → Error logs

**App starts but shows blank page:**
- The `client/dist/` folder must exist — re-run `npm install`
- Check that startup file is set to `dist/src/index.js`

**Database error on startup:**
- Verify `DATABASE_URL` format: `postgresql://user:password@hostname:5432/dbname`
- Run `database/schema.sql` in pgAdmin first

**Admin login fails:**
- Confirm `ADMIN_PASSWORD` env var is saved in hPanel
- Restart the Node.js app after adding env vars
