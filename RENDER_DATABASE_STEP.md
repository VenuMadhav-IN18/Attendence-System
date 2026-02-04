# Render: How to Create PostgreSQL and Get the Database URL

## Step-by-Step (with screens)

---

## Step 1: Go to Render Dashboard

1. Open [https://dashboard.render.com](https://dashboard.render.com)
2. Log in with your GitHub account
3. You should see your **dashboard** with a list of services (or it may be empty)

---

## Step 2: Create a New PostgreSQL Database

1. Look for a button that says **"New +"** (usually top-right)
2. Click **"New +"**
3. A menu will open with options like:
   - **Web Service**
   - **Background Worker**
   - **Cron Job**
   - **Static Site**
   - **PostgreSQL**  ← **Click this one**
4. After clicking **PostgreSQL**, you'll see a form to create the database

---

## Step 3: Fill the Database Form

You might see:

- **Name:** Give a name, e.g. `attendance-db`
- **Database:** (optional) leave default
- **User:** (optional) leave default  
- **Region:** Choose closest to you (e.g. Oregon, Frankfurt)
- **Plan:** Select **Free** (if available)

Then click **"Create Database"** (or **"Create PostgreSQL"**).

---

## Step 4: Wait for Database to Start

1. Render will create the database (takes 1–2 minutes)
2. You’ll see a **green** status or “Available” when it’s ready
3. Click on the **database name** (e.g. `attendance-db`) to open its page

---

## Step 5: Find the “Internal Database URL”

On the database’s page you’ll see several sections. Look for:

- **Connection** or **Connect**
- A box that shows connection info

You need the **Internal Database URL**. It looks like:

```
postgres://user:password@hostname/database_name?options
```

Example:

```
postgres://attendance_db_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com/attendance_db
```

**Where to find it:**

1. On the database page, scroll to **“Connection”** or **“Connect”**
2. You may see:
   - **Internal Database URL** – use this one for your backend on Render
   - External Database URL – use only if your app runs outside Render
3. Next to the URL there is usually a **copy icon** (two overlapping squares)
4. Click the **copy icon** to copy the full URL

**Internal vs External:**

- **Internal Database URL** = use when your **backend is also on Render** (same account). Shorter hostname, faster, more secure.
- **External Database URL** = use when your app runs on your PC or another host.

For your case: backend on Render → use **Internal Database URL**.

---

## Step 6: Save It for Your Backend

1. Paste the copied URL somewhere safe (e.g. Notepad) for now
2. You will add it to your **backend Web Service** as an environment variable:
   - Variable name: `DATABASE_URL`
   - Value: paste the **Internal Database URL** you just copied

---

## Summary

| What you do | Where on Render |
|-------------|------------------|
| Create DB | Dashboard → **New +** → **PostgreSQL** |
| Open DB | Click the database name (e.g. `attendance-db`) |
| Find URL | On DB page → **Connection** / **Connect** → **Internal Database URL** |
| Copy URL | Click the copy icon next to Internal Database URL |
| Use it | Backend service → **Environment** → Add `DATABASE_URL` = (paste URL) |

---

## If You Don’t See “Internal Database URL”

- Look for **“Connection string”** or **“Database URL”**
- Or a section like **“Connect”** with a long link starting with `postgres://`
- That link is your database URL; copy it and use it as `DATABASE_URL`

---

## Next Step After You Have the URL

1. Open your **backend Web Service** on Render (the Node.js app)
2. Go to **Environment** (left menu or tab)
3. Click **“Add Environment Variable”**
4. **Key:** `DATABASE_URL`
5. **Value:** paste the Internal Database URL you copied
6. Save / Redeploy so the backend uses this database

If you tell me exactly what you see on the database page (e.g. “Connection”, “Connect”, “Info”), I can point to the exact line where the Internal Database URL is.
