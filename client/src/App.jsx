import { Routes, Route, NavLink } from 'react-router-dom';
import MarkAttendance from './pages/MarkAttendance';
import Workers from './pages/Workers';
import Records from './pages/Records';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Attendance for Blue Collar Workers</h1>
        <p className="tagline">Track daily wage & contract worker attendance</p>
      </header>

      <nav className="tabs">
        <NavLink to="/" className={({ isActive }) => 'tab' + (isActive ? ' active' : '')} end>
          Mark Attendance
        </NavLink>
        <NavLink to="/workers" className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          Workers
        </NavLink>
        <NavLink to="/records" className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          Attendance Records
        </NavLink>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<MarkAttendance />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/records" element={<Records />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Attendance for Blue Collar Workers &middot; Fullstack (React + Node + MySQL)</p>
      </footer>
    </div>
  );
}

export default App;
