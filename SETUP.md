# How to Run in VS Code

## Step-by-Step Setup

### 1. Create `.env` file
1. In VS Code, right-click in the project root (`pr` folder)
2. Create new file: `.env`
3. Copy content from `.env.example` and update with your MySQL credentials:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=attendance_blue_collar

PORT=5000
```

### 2. Set up MySQL Database
Open MySQL Workbench and run this SQL:

```sql
CREATE DATABASE IF NOT EXISTS attendance_blue_collar;
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

### 3. Install Dependencies (if not done)
Open VS Code integrated terminal (`Ctrl + ~` or `Terminal > New Terminal`):

**Terminal 1 - Root (Backend):**
```powershell
# Make sure you're in project root
cd c:\Users\venum\OneDrive\Desktop\pr

# Install backend dependencies
npm install
```

**Terminal 2 - Client (Frontend):**
```powershell
# Navigate to client folder
cd c:\Users\venum\OneDrive\Desktop\pr\client

# Install frontend dependencies
npm install
```

### 4. Run the Application

You need **TWO terminals** running simultaneously:

#### Terminal 1: Start Backend Server
```powershell
cd c:\Users\venum\OneDrive\Desktop\pr
npm start
```

**Expected output:**
```
Attendance API running at http://localhost:5000
```

#### Terminal 2: Start React Frontend
```powershell
cd c:\Users\venum\OneDrive\Desktop\pr\client
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### 5. Open in Browser
- Open **http://localhost:3000** in your browser
- The React app will automatically connect to the backend API

## VS Code Tips

### Using Multiple Terminals
1. Click the **`+`** button in terminal panel to open new terminal
2. Or use `Ctrl + Shift + ~` to create new terminal
3. Right-click terminal tab → **Split Terminal** to see both side-by-side

### Quick Access
- **Terminal:** `Ctrl + ~` (toggle terminal)
- **Command Palette:** `Ctrl + Shift + P` (search commands)
- **Open File:** `Ctrl + P` (quick file search)

### Troubleshooting

**Port 5000 already in use:**
- Find and stop the process using port 5000, or change `PORT` in `.env`

**MySQL connection error:**
- Check MySQL is running
- Verify `.env` credentials match your MySQL setup
- Ensure database `attendance_blue_collar` exists

**Frontend can't connect to backend:**
- Make sure backend is running on port 5000
- Check `vite.config.js` proxy settings (should be correct)

## Quick Commands Reference

```powershell
# Backend
cd pr
npm start              # Start API server

# Frontend  
cd pr\client
npm run dev            # Start React dev server

# Database (optional - if you prefer script over Workbench)
cd pr
npm run init-db        # Creates DB and tables automatically
```
