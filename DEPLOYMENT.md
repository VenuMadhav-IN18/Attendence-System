# Deployment Guide - Attendance for Blue Collar Workers

This guide covers deploying both the backend (Node.js + MySQL) and frontend (React) to production.

## Deployment Options Overview

| Platform | Backend | Frontend | Database | Cost | Difficulty |
|----------|---------|----------|----------|------|------------|
| **Railway** | ✅ | ✅ | ✅ MySQL | Free tier | ⭐ Easy |
| **Render** | ✅ | ✅ | ✅ PostgreSQL | Free tier | ⭐ Easy |
| **Vercel + Railway** | ✅ (Railway) | ✅ (Vercel) | ✅ MySQL | Free tier | ⭐⭐ Medium |
| **DigitalOcean** | ✅ | ✅ | ✅ Managed DB | $6+/mo | ⭐⭐⭐ Advanced |

---

## Option 1: Railway (Recommended - Easiest)

Railway can host backend, frontend, and MySQL database all in one place.

### Prerequisites
- GitHub account
- Railway account (free tier available)

### Steps

#### 1. Prepare for Deployment

**Update `package.json` scripts:**
```json
{
  "scripts": {
    "start": "node server/index.js",
    "dev": "node server/index.js"
  }
}
```

**Create `Procfile` (for Railway):**
```
web: node server/index.js
```

**Update `client/vite.config.js` for production:**
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // or your subdomain path
  build: {
    outDir: 'dist',
  },
});
```

#### 2. Deploy Backend + Database

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Connect your GitHub and select your repository
4. Railway will detect Node.js → Click **"Deploy"**
5. Add MySQL database:
   - Click **"+ New"** → **"Database"** → **"MySQL"**
   - Railway creates a MySQL instance automatically
6. Set environment variables:
   - Go to your backend service → **"Variables"**
   - Add:
     ```
     MYSQL_HOST=<railway-provided-host>
     MYSQL_USER=<railway-provided-user>
     MYSQL_PASSWORD=<railway-provided-password>
     MYSQL_DATABASE=<railway-provided-database>
     PORT=5000
     ```
   - Railway provides these values automatically - check the MySQL service's "Variables" tab
7. Initialize database:
   - Go to MySQL service → **"Connect"** → Copy connection string
   - Or use Railway's MySQL console to run the SQL from `SETUP.md`
   - Or add a one-time script to run migrations

#### 3. Deploy Frontend

**Option A: Deploy React app separately on Railway**
1. Create new service → **"GitHub Repo"** → Select same repo
2. Set root directory: `client`
3. Build command: `npm install && npm run build`
4. Start command: `npx vite preview --port $PORT --host`
5. Set environment variable: `VITE_API_URL=https://your-backend-url.railway.app`

**Option B: Deploy to Vercel (Recommended for React)**
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New Project"** → Import your GitHub repo
3. Set:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
5. Update `client/src/api.js` to use environment variable:
   ```js
   const BASE = import.meta.env.VITE_API_URL || '/api';
   ```
6. Deploy!

#### 4. Update CORS (Backend)

Update `server/index.js`:
```js
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

---

## Option 2: Render (Free Tier)

### Backend + Database on Render

1. Go to [render.com](https://render.com) and sign up
2. **Create PostgreSQL Database:**
   - New → PostgreSQL
   - Name: `attendance-db`
   - Copy connection string

3. **Deploy Backend:**
   - New → Web Service
   - Connect GitHub repo
   - Settings:
     - **Build Command:** `npm install`
     - **Start Command:** `node server/index.js`
     - **Environment:** Node
   - Add environment variables:
     ```
     MYSQL_HOST=<postgres-host>
     MYSQL_USER=<postgres-user>
     MYSQL_PASSWORD=<postgres-password>
     MYSQL_DATABASE=<postgres-database>
     PORT=5000
     ```
   - **Note:** You'll need to modify code to use PostgreSQL instead of MySQL (use `pg` instead of `mysql2`)

4. **Deploy Frontend:**
   - New → Static Site
   - Connect GitHub repo
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `client/dist`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```

---

## Option 3: Vercel (Frontend) + Railway (Backend)

### Frontend on Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project → Select your repo
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
6. Deploy

### Backend on Railway
Follow Option 1, Step 2 above.

---

## Option 4: DigitalOcean App Platform

### Full Stack Deployment

1. Go to [digitalocean.com](https://digitalocean.com)
2. Create App → GitHub
3. Configure:
   - **Backend Component:**
     - Source: `server/`
     - Build Command: `npm install`
     - Run Command: `node index.js`
     - Environment Variables: MySQL credentials
   - **Frontend Component:**
     - Source: `client/`
     - Build Command: `npm install && npm run build`
     - Output Directory: `dist`
   - **Database:**
     - Add Managed MySQL Database ($15/mo) or use existing

---

## Pre-Deployment Checklist

### Backend Updates Needed

1. **Update CORS** in `server/index.js`:
```js
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://your-production-domain.com'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

2. **Add error handling** for production:
```js
// In server/index.js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

3. **Update API client** in `client/src/api.js`:
```js
const BASE = import.meta.env.VITE_API_URL || '/api';
```

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
MYSQL_HOST=your-db-host
MYSQL_USER=your-db-user
MYSQL_PASSWORD=your-db-password
MYSQL_DATABASE=attendance_blue_collar
PORT=5000
FRONTEND_URL=https://your-frontend-url.com
```

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## Database Migration

### Option A: Manual SQL
Run the SQL from `SETUP.md` in your production database.

### Option B: Migration Script
Create `server/scripts/migrate.js`:
```js
const db = require('../db');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
  await db.query(sql);
  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(console.error);
```

Create `server/schema.sql` with your table definitions.

---

## Quick Deploy Commands

### Railway CLI
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Vercel CLI
```bash
npm install -g vercel
cd client
vercel
```

---

## Post-Deployment

1. **Test API:** `https://your-backend-url.com/api/health`
2. **Test Frontend:** Visit your frontend URL
3. **Check Logs:** Monitor both services for errors
4. **Set up monitoring:** Consider adding error tracking (Sentry, etc.)

---

## Recommended: Railway + Vercel Combo

**Why:**
- Railway: Easy MySQL + Node.js backend (free tier)
- Vercel: Optimized React hosting (free tier, fast CDN)
- Both have excellent free tiers
- Easy to set up

**Steps:**
1. Deploy backend + MySQL on Railway
2. Deploy frontend on Vercel
3. Connect them via environment variables
4. Done! 🚀

---

## Troubleshooting

**CORS errors:**
- Add frontend URL to backend CORS whitelist
- Check environment variables

**Database connection fails:**
- Verify credentials in environment variables
- Check database is accessible from your hosting platform
- Some platforms require IP whitelisting

**Build fails:**
- Check Node.js version (use `.nvmrc` or `engines` in package.json)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

**API not reachable:**
- Verify backend URL is correct
- Check backend is running (view logs)
- Ensure CORS allows your frontend domain
