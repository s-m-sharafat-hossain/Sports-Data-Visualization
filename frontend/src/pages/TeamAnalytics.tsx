import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

interface TeamMatch {
  id: string;
  opponent: string;
  date: string;
  homeScore: number;
  awayScore: number;
  isHome: boolean;
  result: 'W' | 'D' | 'L';
}

export function TeamAnalytics() {
  const { id } = useParams();
  const [matches, setMatches] = useState<TeamMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    const fetchTeamMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<{ matches: TeamMatch[] }>(`/api/team/${id}/recent`);
        if (!mounted) return;
        setMatches(res.data.matches || []);
      } catch (err) {
        console.error('Failed to load team analytics', err);
        if (mounted) setError('Failed to load team analytics');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTeamMatches();
    return () => {
      mounted = false;
    };
  }, [id]);

  const formSeries = useMemo(
    () =>
      matches
        .slice()
        .reverse()
        .map((m, idx) => ({
          label: `${m.result} vs ${m.opponent}`,
          index: idx + 1,
          value: m.result === 'W' ? 3 : m.result === 'D' ? 1 : 0,
        })),
    [matches],
  );

  const distribution = useMemo(() => {
    let win = 0;
    let draw = 0;
    let loss = 0;
    for (const m of matches) {
      if (m.result === 'W') win += 1;
      else if (m.result === 'D') draw += 1;
      else loss += 1;
    }
    return [
      { label: 'Wins', value: win },
      { label: 'Draws', value: draw },
      { label: 'Losses', value: loss },
    ];
  }, [matches]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Team Analytics</h1>
          <p className="text-sm text-slate-400">Team ID: {id}</p>
        </div>
        {loading && <span className="text-xs text-emerald-400">Loading team data...</span>}
      </div>

      {error && <div className="text-xs text-rose-400">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3">Recent Form (Last Matches)</h2>
          {formSeries.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formSeries}>
                  <XAxis dataKey="index" tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: '#1f2937' }}
                    ticks={[0, 1, 3]}
                    tickFormatter={(v) => (v === 3 ? 'W' : v === 1 ? 'D' : 'L')}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1f2937' }}
                    labelFormatter={(idx) => `Match #${idx}`}
                  />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-xs text-slate-400">No recent matches available for this team.</div>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3">Win / Draw / Loss</h2>
          {matches.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribution}>
                  <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1f2937' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {/* Colors chosen to roughly match W/D/L semantics */}
                    {/* index-based color mapping */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-xs text-slate-400">No distribution data available.</div>
          )}
        </section>
      </div>
    </div>
  );
}
