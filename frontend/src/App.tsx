import { Routes, Route, NavLink } from 'react-router-dom';
import { HomeDashboard } from './pages/HomeDashboard';
import { MatchDetails } from './pages/MatchDetails';
import { LeagueOverview } from './pages/LeagueOverview';
import { TeamAnalytics } from './pages/TeamAnalytics';
import { PlayerProfile } from './pages/PlayerProfile';
import { Settings } from './pages/Settings';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded bg-emerald-500" />
          <div className="font-semibold tracking-tight">Sports Data Visualization</div>
        </div>
        <nav className="flex gap-4 text-sm">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-emerald-400' : 'text-slate-300')}>Dashboard</NavLink>
          <NavLink to="/league/4328" className={({ isActive }) => (isActive ? 'text-emerald-400' : 'text-slate-300')}>League</NavLink>
          <NavLink to="/team/1" className={({ isActive }) => (isActive ? 'text-emerald-400' : 'text-slate-300')}>Team</NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'text-emerald-400' : 'text-slate-300')}>Settings</NavLink>
        </nav>
      </header>
      <main className="flex-1 px-4 py-4 max-w-6xl w-full mx-auto">
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/match/:id" element={<MatchDetails />} />
          <Route path="/league/:id" element={<LeagueOverview />} />
          <Route path="/team/:id" element={<TeamAnalytics />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
