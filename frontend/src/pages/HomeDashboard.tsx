import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Match {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  minute?: number;
}

export function HomeDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/matches/live');
        if (mounted) {
          setMatches(res.data.matches || []);
        }
      } catch (err) {
        console.error('Failed to load matches', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const formData = matches.map((m, idx) => ({
    label: `${m.homeTeam.substring(0, 3)}-${m.awayTeam.substring(0, 3)}`,
    goals: m.homeScore + m.awayScore,
    index: idx + 1
  }));

  const winLossData = [
    { label: 'Wins', value: 5 },
    { label: 'Draws', value: 2 },
    { label: 'Losses', value: 1 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Live Scores</h1>
          <p className="text-sm text-slate-400">Real-time overview of ongoing and upcoming matches.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-200 uppercase tracking-wide">Live & Today Matches</h2>
            {loading && <span className="text-xs text-emerald-400">Refreshing...</span>}
          </div>
          <div className="space-y-2 max-h-80 overflow-auto pr-2">
            {matches.map((m) => (
              <Link
                key={m.id}
                to={`/match/${m.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 hover:border-emerald-500/60 hover:bg-slate-900 transition-colors text-sm"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">{m.league}</span>
                  <span className="font-medium">{m.homeTeam} vs {m.awayTeam}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg">
                    {m.homeScore} - {m.awayScore}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      m.status === 'LIVE'
                        ? 'border-emerald-500/60 text-emerald-400'
                        : m.status === 'UPCOMING'
                        ? 'border-slate-500/60 text-slate-300'
                        : 'border-slate-600 text-slate-400'
                    }`}
                  >
                    {m.status} {m.minute ? `· ${m.minute}'` : ''}
                  </span>
                </div>
              </Link>
            ))}
            {!matches.length && !loading && (
              <div className="text-xs text-slate-400">No live matches in the sample data. Connect a real API to see more.</div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
          <div>
            <h2 className="text-xs font-medium text-slate-300 uppercase tracking-wide mb-2">Team Form (Sample)</h2>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formData}>
                  <XAxis dataKey="index" tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                  <YAxis tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1f2937' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Line type="monotone" dataKey="goals" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-medium text-slate-300 uppercase tracking-wide mb-2">Win/Loss Distribution (Sample)</h2>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={winLossData}>
                  <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                  <YAxis tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1f2937' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
