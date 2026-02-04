# Step-by-Step Deployment Guide for Attendence-System

## Current Status ✅
- You've selected: `VenuMadhav-IN18/Attendence-System` repository
- Project structure is ready for deployment

---

## 🎯 Deployment Strategy: Railway (Backend + DB) + Vercel (Frontend)

---

## PART 1: Deploy Backend + MySQL on Railway

### Step 1: Select Repository (You're here!)
✅ You've selected `Attendence-System` - **Click on it or click the arrow** to proceed

### Step 2: Railway Auto-Detection
Railway will detect Node.js automatically. You'll see:
- **Framework:** Node.js
- **Build Command:** (auto-detected)
- **Start Command:** (auto-detected)

**If it asks for configuration:**
- **Root Directory:** Leave empty (or `/`)
- **Build Command:** `npm install` (or leave empty)
- **Start Command:** `node server/index.js`

### Step 3: Add MySQL Database
1. After backend service is created, click **"+ New"** button
2. Select **"Database"** → **"MySQL"**
3. Railway will create MySQL automatically
4. **Copy the database name** (you'll need it)

### Step 4: Set Environment Variables (Backend)
Go to your **backend service** → **"Variables"** tab:

**Click "Reference Variable"** and add these:

| Variable Name | Value (Reference) |
|---------------|-------------------|
| `MYSQL_HOST` | `${{MySQL.MYSQLHOST}}` |
| `MYSQL_USER` | `${{MySQL.MYSQLUSER}}` |
| `MYSQL_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `MYSQL_DATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `PORT` | `5000` |
| `NODE_ENV` | `production` |

**Manual variables (add directly):**
- `PORT` = `5000`
- `NODE_ENV` = `production`

### Step 5: Initialize Database Tables
1. Go to **MySQL service** → **"Connect"** tab
2. Copy the connection details or use Railway's MySQL console
3. Run this SQL (copy from `server/schema.sql`):

```sql
USE attendance_blue_collar;

CREATE TABLE IF NOT EXISTS workers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT '',
  daily_wage DECIMAL(10,2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  worker_id INT NOT NULL,
  status ENUM('present', 'absent') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_date_worker (date, worker_id),
  FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);
```

**OR** use Railway's MySQL console:
- MySQL service → **"Data"** tab → **"Query"** → Paste SQL → Run

### Step 6: Get Backend URL
1. Backend service → **"Settings"** → **"Generate Domain"**
2. Copy the URL (e.g., `https://attendence-system-production.up.railway.app`)
3. **Save this URL** - you'll need it for frontend!

### Step 7: Test Backend
Open in browser: `https://your-backend-url.railway.app/api/health`

Should return: `{"ok":true,"message":"Attendance API"}`

---

## PART 2: Deploy Frontend on Vercel

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **"Add New Project"**

### Step 2: Import Repository
1. Find and select **`Attendence-System`** repository
2. Click **"Import"**

### Step 3: Configure Build Settings
Vercel will auto-detect, but verify these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

**Important:** Click **"Edit"** next to Root Directory and set it to `client`

### Step 4: Add Environment Variable
Before deploying, click **"Environment Variables"**:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend-url.railway.app/api` |

*(Replace `your-backend-url.railway.app` with your actual Railway backend URL from Part 1, Step 6)*

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Copy your frontend URL (e.g., `https://attendence-system.vercel.app`)

---

## PART 3: Connect Frontend to Backend (CORS)

### Update Backend CORS on Railway
1. Go back to **Railway** → Your backend service
2. **"Variables"** tab → Add new variable:
   - **Name:** `FRONTEND_URL`
   - **Value:** `https://your-frontend-url.vercel.app`
   - *(Use the Vercel URL from Part 2, Step 5)*
3. Railway will auto-restart with new CORS settings

---

## PART 4: Test Everything

### ✅ Test Checklist

1. **Backend API Health:**
   - Visit: `https://your-backend.railway.app/api/health`
   - Should return: `{"ok":true,"message":"Attendance API"}`

2. **Frontend:**
   - Visit: `https://your-frontend.vercel.app`
   - Should load the React app

3. **Full Stack Test:**
   - In frontend, try adding a worker
   - Try marking attendance
   - Check if data saves (check Railway MySQL data tab)

---

## 🐛 Troubleshooting

### Backend won't start
- Check Railway logs: Backend service → **"Deployments"** → Click latest → **"View Logs"**
- Common issues:
  - Missing environment variables → Check Variables tab
  - MySQL connection failed → Verify MySQL service is running and variables are referenced correctly

### Frontend can't connect to backend
- Check `VITE_API_URL` is set correctly in Vercel
- Check backend CORS includes frontend URL
- Test backend API directly in browser

### Database errors
- Verify tables exist: MySQL service → **"Data"** → Check tables
- Re-run `server/schema.sql` if tables missing

### CORS errors in browser console
- Add frontend URL to `FRONTEND_URL` variable in Railway backend
- Check backend logs for CORS errors

---

## 📋 Quick Reference

### Backend URLs
- **Railway Dashboard:** [railway.app](https://railway.app)
- **Your Backend:** `https://your-backend.railway.app`
- **API Health:** `https://your-backend.railway.app/api/health`

### Frontend URLs
- **Vercel Dashboard:** [vercel.com](https://vercel.com)
- **Your Frontend:** `https://your-frontend.vercel.app`

### Environment Variables Summary

**Railway (Backend):**
```
MYSQL_HOST=${{MySQL.MYSQLHOST}}
MYSQL_USER=${{MySQL.MYSQLUSER}}
MYSQL_PASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQL_DATABASE=${{MySQL.MYSQLDATABASE}}
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

**Vercel (Frontend):**
```
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🎉 Success!

Once both are deployed and connected:
- ✅ Backend running on Railway
- ✅ Frontend running on Vercel
- ✅ Database initialized
- ✅ CORS configured
- ✅ Full stack app is LIVE! 🚀

---

## Next Steps (Optional)

- Add custom domain
- Set up automatic deployments (auto-deploys on git push)
- Add error monitoring (Sentry)
- Set up CI/CD pipelines
