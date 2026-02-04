# Fix: 405 Method Not Allowed Error

## What the Error Means

**405 "Method Not Allowed"** means:
- The backend received the request
- But the HTTP method (GET, POST, etc.) doesn't match what the route expects
- OR the route doesn't exist at that path

---

## Common Causes & Fixes

### 1. Backend Not Running ❌

**Check:**
- Is your backend deployed and running?
- Can you access: `https://your-backend-url/api/health`?

**Fix:**
- Deploy backend on Render/Railway/etc.
- Ensure it's running and accessible

---

### 2. Wrong API URL in Frontend ❌

**Check Vercel Environment Variables:**
- Go to Vercel → Your Project → **Settings** → **Environment Variables**
- Check `VITE_API_URL` value

**Correct Format:**
```
VITE_API_URL=https://your-backend.onrender.com/api
```
OR
```
VITE_API_URL=https://your-backend.onrender.com
```
(Code will auto-add `/api` if missing)

**Wrong Format:**
```
VITE_API_URL=https://your-backend.onrender.com/workers  ❌
```

**Fix:**
1. Update `VITE_API_URL` to your backend URL + `/api`
2. Redeploy frontend

---

### 3. CORS Blocking Request ❌

**Check:**
- Open browser DevTools → **Network** tab
- Look for CORS errors (red)

**Fix:**
- Backend CORS updated to allow your frontend domain
- Set `FRONTEND_URL` in backend environment variables
- Backend code already updated to handle this

---

### 4. Backend Route Not Matching ❌

**Check Backend Routes:**
- `/api/workers` should handle GET requests
- Backend code looks correct

**Test Backend Directly:**
```bash
# In browser or Postman
GET https://your-backend-url/api/workers
GET https://your-backend-url/api/health
```

If these don't work, backend has issues.

---

## Step-by-Step Debugging

### Step 1: Check Backend is Running

1. Open: `https://your-backend-url/api/health`
2. Should return: `{"ok":true,"message":"Attendance API"}`
3. If error → Backend not running or wrong URL

### Step 2: Check Frontend API URL

1. Open browser DevTools → **Console**
2. Look for: `API Request: ...` logs (added in code)
3. Check the URL being called
4. Should be: `https://your-backend-url/api/workers`

### Step 3: Check Network Tab

1. DevTools → **Network** tab
2. Find the failed request to `/api/workers`
3. Check:
   - **Status:** 405?
   - **Request URL:** What URL is it hitting?
   - **Request Method:** GET?
   - **Response:** What does backend return?

### Step 4: Check Backend Logs

1. Go to your backend platform (Render/Railway)
2. View **Logs**
3. Look for errors or CORS messages
4. Check if requests are reaching backend

---

## Quick Fixes Applied

### ✅ Updated CORS (server/index.js)
- More permissive CORS
- Allows all methods (GET, POST, PUT, DELETE)
- Better error logging

### ✅ Fixed API Client (client/src/api.js)
- Handles `VITE_API_URL` with or without `/api`
- Adds debug logging
- Better error handling

---

## Most Likely Fix

**90% of 405 errors are due to:**

1. **Backend not running** → Deploy backend first
2. **Wrong `VITE_API_URL`** → Set correct backend URL in Vercel
3. **CORS blocking** → Backend CORS updated, set `FRONTEND_URL` in backend env vars

---

## Checklist

- [ ] Backend is deployed and running
- [ ] Backend health check works: `https://backend-url/api/health`
- [ ] `VITE_API_URL` is set in Vercel (with `/api` at end)
- [ ] `FRONTEND_URL` is set in backend env vars (your Vercel URL)
- [ ] Backend logs show requests arriving
- [ ] CORS allows your frontend domain

---

## Test Commands

**Test Backend:**
```bash
# Health check
curl https://your-backend-url/api/health

# Get workers
curl https://your-backend-url/api/workers
```

**Test Frontend:**
1. Open browser DevTools → Console
2. Look for API request logs
3. Check Network tab for actual requests

---

## Still Not Working?

Share:
1. Backend URL
2. Frontend URL
3. `VITE_API_URL` value from Vercel
4. Backend logs (any errors?)
5. Browser console errors
6. Network tab details for the failed request
