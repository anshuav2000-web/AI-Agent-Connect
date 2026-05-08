# HiTech AI — DiGiCo WhatsApp Support Platform
### Self-Hosted Deployment Guide for Hostinger Node.js

---

## What's included

```
hitech-ai/
├── server/                  # Express.js API backend (TypeScript)
│   ├── src/
│   │   ├── index.ts         # Main server entry point
│   │   ├── db/
│   │   │   ├── index.ts     # Database connection (Drizzle ORM)
│   │   │   └── schema.ts    # All table definitions
│   │   └── routes/
│   │       ├── index.ts     # Route aggregator
│   │       ├── leads.ts     # Public lead submission
│   │       ├── site-settings.ts  # Public site settings
│   │       └── admin/       # Protected admin routes
│   ├── drizzle.config.ts
│   └── package.json
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/           # All pages (home + admin dashboard)
│   │   ├── components/      # UI components + SplashScreen
│   │   └── lib/
│   │       └── admin-api.ts # Admin API client
│   └── package.json
├── database/
│   ├── schema.sql           # Full PostgreSQL schema
│   └── seed.sql             # Sample demo data
├── ecosystem.config.js      # PM2 process manager config
├── .env.example             # All required environment variables
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- PM2 (`npm install -g pm2`)
- A Hostinger Node.js hosting plan

---

## Step 1 — Upload files to Hostinger

1. Zip this entire `hitech-ai/` folder
2. Upload via Hostinger File Manager or FTP to your home directory (e.g. `~/hitech-ai/`)
3. Or use SSH + git:
   ```bash
   ssh user@yourdomain.com
   git clone https://github.com/yourrepo/hitech-ai.git
   ```

---

## Step 2 — Set up the database

### Option A — Hostinger PostgreSQL (recommended)
1. Go to Hostinger Panel → Databases → PostgreSQL → Create new database
2. Note your: `hostname`, `port`, `database name`, `username`, `password`
3. Connect via pgAdmin or SSH tunnel and run:
   ```bash
   psql -h hostname -U username -d dbname -f database/schema.sql
   psql -h hostname -U username -d dbname -f database/seed.sql   # optional demo data
   ```

### Option B — External database (PlanetScale, Neon, Supabase)
Use the connection string from your provider directly in `DATABASE_URL`.

---

## Step 3 — Configure environment variables

```bash
cp .env.example .env
nano .env
```

Fill in all values:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME
ADMIN_PASSWORD=YourSecurePasswordHere
SESSION_SECRET=replace-with-a-64-character-random-string
N8N_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/xxxx
CLIENT_URL=https://yourdomain.com
```

Generate a secure session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 4 — Install dependencies

```bash
# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

---

## Step 5 — Build the application

```bash
# Build frontend (outputs to client/dist/)
cd client && npm run build && cd ..

# Build backend (outputs to server/dist/)
cd server && npm run build && cd ..
```

Or run both with the root convenience script:
```bash
npm run build
```

---

## Step 6 — Push database schema (alternative to SQL import)

If you prefer using Drizzle's push instead of the SQL file:
```bash
cd server
npx drizzle-kit push --config drizzle.config.ts
cd ..
```

---

## Step 7 — Start with PM2

```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Create logs directory
mkdir -p logs

# Start the app
pm2 start ecosystem.config.js

# Save PM2 process list (auto-restart on reboot)
pm2 save
pm2 startup
```

Useful PM2 commands:
```bash
pm2 status          # Check if running
pm2 logs hitech-ai  # View live logs
pm2 restart hitech-ai
pm2 stop hitech-ai
```

---

## Step 8 — Connect your custom domain on Hostinger

1. **Hostinger Panel → Websites → Manage → Domain**
2. Point your domain's DNS A record to your VPS IP address
3. In Hostinger's Apache/Nginx panel, create a reverse proxy:

### Nginx reverse proxy config (if using VPS):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Hostinger shared Node.js hosting:
- Set your **Application startup file** to: `server/dist/index.js`
- Set **Node.js version** to 20.x
- Set environment variables in the Hostinger panel (not via .env file)

---

## Step 9 — SSL / HTTPS

### Option A — Hostinger built-in SSL (easiest)
Go to Hostinger Panel → SSL → Enable Free SSL (Let's Encrypt). Done.

### Option B — Certbot on VPS
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Admin Dashboard

Access at: `https://yourdomain.com/admin`

**Default password:** Set via `ADMIN_PASSWORD` environment variable

**Admin features:**
| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/admin` | Live stats, activity feed |
| Access Requests | `/admin/requests` | View, approve, reject, edit, delete leads |
| Analytics | `/admin/analytics` | Charts: daily requests, countries, status |
| Content Editor | `/admin/content` | Edit hero text, banner, section titles |
| Logo & Branding | `/admin/branding` | Logo URL, colours, site name |
| WhatsApp Config | `/admin/whatsapp` | Phone number, message templates |
| Console Models | `/admin/models` | Add/remove supported console models |
| Knowledge Base | `/admin/knowledge` | Edit FAQ items |
| Notifications | `/admin/notifications` | Live activity feed |
| Webhook / n8n | `/admin/webhook` | Set n8n URL, test connection |
| Settings | `/admin/settings` | Site configuration |

---

## n8n Webhook Integration

1. Create a workflow in n8n with an **HTTP Webhook** trigger node
2. Copy the webhook URL from n8n
3. In the admin dashboard go to **Webhook / n8n → Webhook Settings**
4. Paste the URL and click Save
5. Click **Test Connection** to verify

The webhook receives this payload on every new lead submission:
```json
{
  "event": "new_lead",
  "lead": {
    "id": 42,
    "fullName": "Jane Smith",
    "email": "jane@company.com",
    "phone": "+1 555 000 0000",
    "country": "United Kingdom",
    "consoleModel": "Quantum7",
    "requirement": "...",
    "referralSource": "LinkedIn",
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## Development (local)

```bash
# Terminal 1 — API server with hot reload
cd server && npm run dev

# Terminal 2 — Vite dev server (with proxy to :3000)
cd client && npm run dev
```

Open `http://localhost:5173`

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `production` or `development` |
| `PORT` | Yes | Port to run server on (default 3000) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Yes | Admin dashboard login password |
| `SESSION_SECRET` | Yes | Random 32+ char string for sessions |
| `N8N_WEBHOOK_URL` | No | Can also be set from admin dashboard |
| `CLIENT_URL` | No | Your domain for CORS (production) |

---

## Troubleshooting

**App won't start after `npm start`:**
- Check `pm2 logs hitech-ai` for errors
- Verify `DATABASE_URL` is correct and DB is reachable
- Confirm `server/dist/index.js` exists (run `npm run build` first)

**Database connection error:**
- Test connection: `psql "$DATABASE_URL" -c "SELECT 1"`
- Check firewall rules allow your server IP on port 5432

**Admin login fails:**
- Verify `ADMIN_PASSWORD` env var is set
- Try restarting: `pm2 restart hitech-ai`

**Frontend shows blank page:**
- Check `client/dist/` exists and contains `index.html`
- Check browser console for errors
- Make sure Nginx is proxying correctly

**Webhook not receiving data:**
- Use **Test Connection** in admin dashboard
- Ensure your n8n instance is publicly accessible
- Check webhook logs in the database: `SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 10;`

---

## Security Checklist

- [ ] Change `ADMIN_PASSWORD` from default
- [ ] Set a strong random `SESSION_SECRET` (64+ chars)
- [ ] Enable HTTPS / SSL on your domain
- [ ] Set `CLIENT_URL` to your production domain
- [ ] Set `NODE_ENV=production`
- [ ] Restrict database port 5432 to server IP only
- [ ] Regular database backups configured

---

## Support

For issues with this application code, review the logs:
```bash
pm2 logs hitech-ai --lines 100
```

For Hostinger hosting issues, contact Hostinger support at hostinger.com/support.

---

*HiTech AI Agent — AI-powered DiGiCo console support on WhatsApp*
*Not affiliated with DiGiCo UK Ltd.*
