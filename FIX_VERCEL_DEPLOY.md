# Fix Vercel Deployment Failure

## Common Causes & Solutions

---

## Issue 1: Root Directory Not Set

**Problem:** Vercel is trying to build from the root (`pr/`) instead of `client/` folder.

**Fix:**

1. Go to your Vercel project dashboard
2. Click **"Settings"** (top menu)
3. Click **"General"** (left sidebar)
4. Scroll to **"Root Directory"**
5. Click **"Edit"** → Set to: **`client`**
6. Click **"Save"**
7. Go back to **"Deployments"** → Click **"Redeploy"** (three dots menu) → **"Redeploy"**

---

## Issue 2: Build Settings Not Configured

**Fix:**

1. Vercel project → **"Settings"** → **"General"**
2. Scroll to **"Build and Development Settings"**
3. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Root Directory** | `client` |

4. **Save**
5. **Redeploy**

---

## Issue 3: Missing Dependencies or Build Errors

**Check Build Logs:**

1. Click on the **failed deployment**
2. Scroll down in **"Build Logs"** to see the actual error
3. Common errors:

**Error: "Cannot find module"**
- Solution: Dependencies might be missing
- Fix: Ensure `client/package.json` has all dependencies

**Error: "Command failed"**
- Solution: Build command might be wrong
- Fix: Set Build Command to `npm run build` (not `cd client && npm run build` if Root Directory is set)

**Error: "ENOENT: no such file or directory"**
- Solution: Output directory wrong
- Fix: Set Output Directory to `dist` (not `client/dist` if Root Directory is set)

---

## Issue 4: Vercel.json Not Being Read

**If Vercel ignores `vercel.json`:**

1. **Delete `vercel.json`** from root (it might conflict)
2. Configure everything in **Vercel Dashboard** instead:
   - Settings → General → Root Directory: `client`
   - Settings → General → Build Command: `npm run build`
   - Settings → General → Output Directory: `dist`
3. Redeploy

---

## Step-by-Step Fix (Recommended)

### Step 1: Check Current Settings

1. Vercel Dashboard → Your project → **"Settings"**
2. **"General"** tab
3. Check:
   - **Root Directory:** Should be `client` (not empty, not `/`)
   - **Framework Preset:** Should be `Vite` (or auto-detected)

### Step 2: Update Build Settings

In **"Build and Development Settings"**:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Important:** If Root Directory is `client`, then:
- Build Command = `npm run build` (NOT `cd client && npm run build`)
- Output Directory = `dist` (NOT `client/dist`)

### Step 3: Check Environment Variables

1. **"Settings"** → **"Environment Variables"**
2. Add if missing:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com/api` (or your backend URL)
   - **Environment:** Production, Preview, Development (check all)

### Step 4: Redeploy

1. Go to **"Deployments"** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Wait for build to complete

---

## Quick Fix Checklist

- [ ] Root Directory set to `client` in Vercel Settings
- [ ] Build Command = `npm run build` (not `cd client && npm run build`)
- [ ] Output Directory = `dist` (not `client/dist`)
- [ ] Framework Preset = Vite
- [ ] Environment Variable `VITE_API_URL` is set
- [ ] Redeployed after changes

---

## If Still Failing: Check Full Error

1. Click on failed deployment
2. Scroll down in **"Build Logs"**
3. Look for red error messages
4. Common errors:

**"npm ERR! code ELIFECYCLE"**
- Missing dependency or script issue
- Check `client/package.json` has correct scripts

**"Error: ENOENT: no such file or directory"**
- Wrong paths in build settings
- Fix Root Directory and Output Directory

**"Module not found"**
- Missing dependency
- Vercel should auto-install, but check `package.json`

**"Build command failed"**
- Build command syntax error
- Use: `npm run build` (simple, no `cd`)

---

## Alternative: Delete and Recreate Project

If nothing works:

1. **Delete** the current Vercel project
2. **Create new project** → Import `Attendence-System` repo
3. **Before deploying**, configure:
   - Root Directory: `client`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add `VITE_API_URL` environment variable
5. Deploy

---

## Test Locally First

Before deploying, test build locally:

```powershell
cd c:\Users\venum\OneDrive\Desktop\pr\client
npm install
npm run build
```

If this works locally, Vercel should work too (with correct settings).

---

## Most Likely Fix

**90% of Vercel failures are due to Root Directory not being set.**

**Do this:**
1. Settings → General → Root Directory → Set to `client`
2. Save
3. Redeploy

This should fix it! 🚀
