# Quick Deploy Guide 🚀

## Easiest Method: Railway (Backend) + Vercel (Frontend)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) → Sign up/login
2. **New Project** → **Deploy from GitHub repo** → Select your repo
3. Railway auto-detects Node.js → Click **Deploy**
4. **Add MySQL Database:**
   - Click **"+ New"** → **"Database"** → **"MySQL"**
   - Railway creates MySQL automatically
5. **Set Environment Variables:**
   - Go to your backend service → **"Variables"** tab
   - Click **"Reference Variable"** → Select MySQL service variables:
     - `MYSQL_HOST` → `${{MySQL.MYSQLHOST}}`
     - `MYSQL_USER` → `${{MySQL.MYSQLUSER}}`
     - `MYSQL_PASSWORD` → `${{MySQL.MYSQLPASSWORD}}`
     - `MYSQL_DATABASE` → `${{MySQL.MYSQLDATABASE}}`
     - `PORT` → `5000`
6. **Initialize Database:**
   - Go to MySQL service → **"Connect"** → Copy connection details
   - Use MySQL Workbench or Railway's console to run `server/schema.sql`
7. **Copy Backend URL:**
   - Backend service → **"Settings"** → Copy the domain (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up/login
2. **Add New Project** → Import your GitHub repo
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Add Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app/api`
   - (Use the backend URL from Step 2)
5. Click **Deploy**

### Step 4: Update CORS (Backend)

1. Go back to Railway → Your backend service
2. **Variables** → Add:
   - Name: `FRONTEND_URL`
   - Value: `https://your-frontend-url.vercel.app`
   - (Use the Vercel URL from Step 3)
3. Railway will auto-restart with new CORS settings

### Step 5: Test

- Frontend: Visit your Vercel URL
- Backend API: `https://your-backend-url.railway.app/api/health`

---

## Alternative: Deploy Everything on Railway

### Single Platform Deployment

1. **Deploy Backend** (same as Step 2 above)
2. **Deploy Frontend on Railway:**
   - New Service → GitHub Repo → Same repo
   - **Settings:**
     - Root Directory: `client`
     - Build Command: `npm install && npm run build`
     - Start Command: `npx vite preview --port $PORT --host`
   - **Variables:**
     - `VITE_API_URL` → `https://your-backend-url.railway.app/api`
3. Railway will give you a frontend URL

---

## Environment Variables Summary

### Backend (Railway)
```
MYSQL_HOST=${{MySQL.MYSQLHOST}}
MYSQL_USER=${{MySQL.MYSQLUSER}}
MYSQL_PASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQL_DATABASE=${{MySQL.MYSQLDATABASE}}
PORT=5000
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## Troubleshooting

**Database connection fails:**
- Verify MySQL service is running on Railway
- Check environment variables are correctly referenced
- Run `server/schema.sql` in MySQL to create tables

**CORS errors:**
- Ensure `FRONTEND_URL` is set in backend environment variables
- Check frontend URL matches exactly (including https://)

**Frontend can't reach backend:**
- Verify `VITE_API_URL` is set correctly
- Check backend is deployed and running (view Railway logs)
- Test backend directly: `https://your-backend.railway.app/api/health`

---

## Cost

- **Railway:** Free tier (500 hours/month, $5 credit)
- **Vercel:** Free tier (unlimited for personal projects)
- **Total:** $0/month for small projects! 🎉

---

## Next Steps

- Set up custom domains (optional)
- Add error monitoring (Sentry)
- Set up CI/CD (automatic deployments on git push)
