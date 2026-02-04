# Deployment Alternatives (Other Than Railway)

## 🎯 Quick Comparison

| Platform | Backend | Frontend | Database | Free Tier | Difficulty |
|----------|---------|----------|----------|-----------|------------|
| **Render** | ✅ | ✅ | ✅ PostgreSQL | Yes | ⭐ Easy |
| **Vercel + Render** | ✅ (Render) | ✅ (Vercel) | ✅ PostgreSQL | Yes | ⭐⭐ Medium |
| **Heroku** | ✅ | ✅ | ✅ PostgreSQL | Limited | ⭐⭐ Medium |
| **DigitalOcean** | ✅ | ✅ | ✅ Managed MySQL | $6+/mo | ⭐⭐⭐ Advanced |
| **Fly.io** | ✅ | ✅ | ✅ PostgreSQL | Yes | ⭐⭐ Medium |
| **AWS** | ✅ | ✅ | ✅ RDS MySQL | Free tier | ⭐⭐⭐⭐ Advanced |

---

## Option 1: Render (All-in-One) ⭐ Recommended Alternative

### Why Render?
- Free tier available
- PostgreSQL included (we'll adapt code)
- Simple deployment
- Auto-deploys from GitHub

### Step 1: Prepare Code for PostgreSQL

**Create `server/config/db-pg.js` (PostgreSQL version):**
```js
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

module.exports = {
  host: process.env.PG_HOST || process.env.DATABASE_URL?.split('@')[1]?.split(':')[0],
  user: process.env.PG_USER || process.env.DATABASE_URL?.split('//')[1]?.split(':')[0],
  password: process.env.PG_PASSWORD || process.env.DATABASE_URL?.split(':')[2]?.split('@')[0],
  database: process.env.PG_DATABASE || process.env.DATABASE_URL?.split('/').pop()?.split('?')[0],
  port: process.env.PG_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};
```

**Update `server/db.js` to support both:**
```js
const mysql = require('mysql2/promise');
const pg = require('pg');
const config = require('./config/db');

// Check if PostgreSQL URL is provided
if (process.env.DATABASE_URL) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  module.exports = {
    query: async (text, params) => {
      const result = await pool.query(text, params);
      return [result.rows, result];
    },
  };
} else {
  // MySQL fallback
  module.exports = mysql.createPool(config);
}
```

**Add PostgreSQL dependency:**
```bash
npm install pg
```

**Create PostgreSQL schema (`server/schema-pg.sql`):**
```sql
-- PostgreSQL schema for Attendance Blue Collar Workers

CREATE TABLE IF NOT EXISTS workers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT '',
  daily_wage DECIMAL(10,2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  worker_id INTEGER NOT NULL,
  status VARCHAR(20) CHECK (status IN ('present', 'absent')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, worker_id),
  FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);
```

### Step 2: Deploy Backend on Render

1. **Go to [render.com](https://render.com)** → Sign up/login with GitHub

2. **Create PostgreSQL Database:**
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `attendance-db`
   - Plan: **Free** (or paid)
   - Click **"Create Database"**
   - **Copy the "Internal Database URL"** (you'll need it)

3. **Deploy Backend:**
   - Click **"New +"** → **"Web Service"**
   - Connect GitHub → Select `Attendence-System` repo
   - Configure:
     - **Name:** `attendance-backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `node server/index.js`
     - **Plan:** Free (or paid)

4. **Set Environment Variables:**
   - **`DATABASE_URL`** → Paste the PostgreSQL Internal Database URL from step 2
   - **`NODE_ENV`** → `production`
   - **`PORT`** → `5000`
   - **`FRONTEND_URL`** → (leave empty for now, add after frontend deploys)

5. **Initialize Database:**
   - Go to PostgreSQL service → **"Connect"** → Copy connection string
   - Use `psql` or Render's shell to run `server/schema-pg.sql`
   - Or use Render's **"Shell"** tab:
     ```bash
     psql $DATABASE_URL -f server/schema-pg.sql
     ```

6. **Get Backend URL:**
   - Backend service → Copy the URL (e.g., `https://attendance-backend.onrender.com`)

### Step 3: Deploy Frontend on Render

1. **New +** → **"Static Site"**
2. Connect GitHub → Select `Attendence-System` repo
3. Configure:
   - **Name:** `attendance-frontend`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `client/dist`
4. **Environment Variable:**
   - **`VITE_API_URL`** → `https://your-backend.onrender.com/api`
5. **Deploy!**

### Step 4: Update CORS
- Backend → Environment Variables → Add:
  - **`FRONTEND_URL`** → `https://your-frontend.onrender.com`

---

## Option 2: Vercel (Frontend) + Render (Backend)

### Frontend on Vercel (Same as before)

1. [vercel.com](https://vercel.com) → Add New Project
2. Import `Attendence-System` repo
3. Settings:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variable:**
   - **`VITE_API_URL`** → `https://your-backend.onrender.com/api`
5. Deploy

### Backend on Render
Follow **Option 1, Step 2** above.

---

## Option 3: Fly.io (Free Tier)

### Why Fly.io?
- Free tier with generous limits
- PostgreSQL included
- Global edge deployment
- Good for Node.js apps

### Step 1: Install Fly CLI
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Or download from: https://fly.io/docs/hands-on/install-flyctl/
```

### Step 2: Login
```bash
fly auth login
```

### Step 3: Create Backend App
```bash
cd c:\Users\venum\OneDrive\Desktop\pr
fly launch
```

Follow prompts:
- App name: `attendance-backend` (or your choice)
- Region: Choose closest
- PostgreSQL: **Yes** (creates database)
- Deploy: **Yes**

### Step 4: Configure Backend
Create `fly.toml` in project root:
```toml
app = "attendance-backend"
primary_region = "iad"

[build]

[http_service]
  internal_port = 5000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[services]]
  http_checks = []
  internal_port = 5000
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
```

### Step 5: Set Secrets
```bash
fly secrets set DATABASE_URL=$(fly postgres connect -a attendance-backend-db)
fly secrets set NODE_ENV=production
fly secrets set PORT=5000
```

### Step 6: Deploy
```bash
fly deploy
```

### Step 7: Deploy Frontend
Create `client/fly.toml`:
```toml
app = "attendance-frontend"
primary_region = "iad"

[build]

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[services]]
  http_checks = []
  internal_port = 3000
  processes = ["app"]
  protocol = "tcp"
```

```bash
cd client
fly launch
fly secrets set VITE_API_URL=https://attendance-backend.fly.dev/api
fly deploy
```

---

## Option 4: DigitalOcean App Platform

### Why DigitalOcean?
- Managed MySQL included
- Simple deployment
- $5/month credit for new users
- More control than free tiers

### Step 1: Create App
1. [digitalocean.com](https://digitalocean.com) → **App Platform**
2. **Create App** → Connect GitHub → Select `Attendence-System`

### Step 2: Configure Components

**Backend Component:**
- **Source:** `server/`
- **Build Command:** `npm install`
- **Run Command:** `node index.js`
- **Environment Variables:**
  - `NODE_ENV=production`
  - `PORT=5000`
  - (MySQL vars will be auto-provided)

**Frontend Component:**
- **Source:** `client/`
- **Build Command:** `npm install && npm run build`
- **Output Directory:** `dist`
- **Environment Variable:**
  - `VITE_API_URL=https://your-backend.ondigitalocean.app/api`

**Database Component:**
- **Add Database** → MySQL → Development ($15/mo) or Basic ($12/mo)
- Tables auto-created via connection

### Step 3: Deploy
Click **"Create Resources"** → Wait for deployment

---

## Option 5: Heroku (Classic Option)

### Why Heroku?
- Well-established platform
- PostgreSQL addon
- Simple deployment
- Limited free tier (now paid)

### Step 1: Install Heroku CLI
Download from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)

### Step 2: Login
```bash
heroku login
```

### Step 3: Create Backend App
```bash
cd c:\Users\venum\OneDrive\Desktop\pr
heroku create attendance-backend
```

### Step 4: Add PostgreSQL
```bash
heroku addons:create heroku-postgresql:mini
```

### Step 5: Set Config Vars
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
```

### Step 6: Deploy
```bash
git push heroku main
```

### Step 7: Initialize Database
```bash
heroku run node server/scripts/init-db.js
# Or use Heroku Postgres console to run schema-pg.sql
```

### Step 8: Deploy Frontend
Create separate Heroku app or use Vercel/Netlify for frontend.

---

## Option 6: Netlify (Frontend) + Any Backend

### Frontend on Netlify

1. [netlify.com](https://netlify.com) → **Add New Site** → **Import from Git**
2. Select `Attendence-System` repo
3. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
4. **Environment Variables:**
   - **`VITE_API_URL`** → Your backend URL + `/api`
5. Deploy

**Backend:** Use any of the above options (Render, Fly.io, etc.)

---

## Quick Decision Guide

**Choose Render if:**
- ✅ Want everything in one place
- ✅ Need PostgreSQL (can adapt code)
- ✅ Want free tier
- ✅ Simple setup

**Choose Vercel + Render if:**
- ✅ Want best frontend hosting (Vercel)
- ✅ Want simple backend (Render)
- ✅ Need free tier
- ✅ Don't mind two platforms

**Choose Fly.io if:**
- ✅ Want global edge deployment
- ✅ Need PostgreSQL
- ✅ Comfortable with CLI
- ✅ Want free tier with good limits

**Choose DigitalOcean if:**
- ✅ Need MySQL (not PostgreSQL)
- ✅ Want managed database
- ✅ Have budget ($12-15/month)
- ✅ Want more control

**Choose Heroku if:**
- ✅ Familiar with Heroku
- ✅ Have Heroku account
- ✅ Need PostgreSQL
- ⚠️ Note: Paid plans now

---

## Code Changes Needed for PostgreSQL

If using Render/Fly.io/Heroku (PostgreSQL), update:

1. **Install `pg` package:**
   ```bash
   npm install pg
   ```

2. **Update `server/db.js`** (see Option 1 above)

3. **Update routes** - PostgreSQL uses different syntax:
   - `?` placeholders instead of `?`
   - Different result structure

**OR** keep MySQL and use:
- DigitalOcean (managed MySQL)
- Railway (MySQL)
- AWS RDS MySQL
- Self-hosted MySQL

---

## Recommendation

**Best Free Option:** **Render** (all-in-one) or **Vercel + Render** (best of both)

**Best Paid Option:** **DigitalOcean** (if you need MySQL specifically)

See specific platform guides above for detailed steps!
