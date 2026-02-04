# Attendance for Blue Collar Workers

Attendance tracking system for daily wage and contract workers. Built in three phases: HTML/CSS/JS foundation, Node.js + MySQL backend, and React frontend.

## Project structure

- **phase1/** – Static frontend (HTML, CSS, JavaScript) with `localStorage`. No server required.
- **server/** – Node.js + Express API and MySQL (Phase 2).
- **client/** – React (Vite) frontend that talks to the API (Phase 3).

## Phase 1: Basics (HTML, CSS, JavaScript)

1. Open `phase1/index.html` in a browser (or use a simple static server).
2. Add workers in the **Workers** tab, then mark attendance by date in **Mark Attendance**, and view **Attendance Records**.

Data is stored in the browser’s `localStorage`.

## Phase 2: Backend (Node.js + MySQL)

### Prerequisites

- Node.js (v18+)
- MySQL server

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file and set your MySQL credentials:
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and set `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`.

3. Create database and tables:
   ```bash
   npm run init-db
   ```

4. Start the API server:
   ```bash
   npm start
   ```
   API runs at **http://localhost:5000**.

### API overview

- `GET /api/workers` – List workers  
- `POST /api/workers` – Create worker (body: `name`, `role`, `dailyWage`)  
- `GET /api/workers/:id` – Get worker  
- `PUT /api/workers/:id` – Update worker  
- `DELETE /api/workers/:id` – Delete worker  
- `GET /api/attendance?dateFrom=&dateTo=&workerId=` – List attendance  
- `GET /api/attendance/by-date/:date` – Attendance for one date  
- `POST /api/attendance/save` – Save attendance (body: `date`, `entries: [{ workerId, status }]`)

## Phase 3: React frontend

The React app uses the Phase 2 API.

### Run the React app

1. From the project root, install backend deps (if not done):
   ```bash
   npm install
   ```

2. Install client dependencies and run the dev server:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Frontend runs at **http://localhost:3000**. Vite proxies `/api` to the backend (port 5000).

### Fullstack workflow

1. Start the backend: from project root, `npm start` (API on port 5000).  
2. Start the frontend: `cd client && npm run dev` (app on port 3000).  
3. Open http://localhost:3000 and use Mark Attendance, Workers, and Attendance Records.

## Tech stack

- **Phase 1:** HTML5, CSS3, vanilla JavaScript, `localStorage`  
- **Phase 2:** Node.js, Express, MySQL (mysql2), CORS, dotenv  
- **Phase 3:** React 18, React Router, Vite

## License

MIT
