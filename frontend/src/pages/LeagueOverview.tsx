import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface StandingRow {
  idTeam: string;
  name: string;
  played: number;
  win: number;
  draw: number;
  loss: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

interface ApiStandingRow {
  idTeam: string;
  strTeam: string;
  intPlayed: string;
  intWin: string;
  intDraw: string;
  intLoss: string;
  intGoalsFor: string;
  intGoalsAgainst: string;
  intPoints: string;
}

export function LeagueOverview() {
  const { id } = useParams();
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [season, setSeason] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchStandings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/league/${id}/standings`);
        if (!mounted) return;
        const apiRows: ApiStandingRow[] = res.data.standings || [];
        const mapped: StandingRow[] = apiRows.map((r) => ({
          idTeam: r.idTeam,
          name: r.strTeam,
          played: Number(r.intPlayed || 0),
          win: Number(r.intWin || 0),
          draw: Number(r.intDraw || 0),
          loss: Number(r.intLoss || 0),
          goalsFor: Number(r.intGoalsFor || 0),
          goalsAgainst: Number(r.intGoalsAgainst || 0),
          points: Number(r.intPoints || 0)
        }));
        setStandings(mapped);
        setSeason(res.data.season || '');
      } catch (err) {
        console.error('Failed to load league standings', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStandings();

    return () => {
      mounted = false;
    };
  }, [id]);

  const topForChart = standings.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">League Overview</h1>
          <p className="text-sm text-slate-400">
            League ID: {id} {season && <span className="ml-1">· Season {season}</span>}
          </p>
        </div>
        {loading && <span className="text-xs text-emerald-400">Loading standings...</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 overflow-x-auto">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3">Standings</h2>
          {standings.length ? (
            <table className="min-w-full text-xs">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-2 py-1 text-left">#</th>
                  <th className="px-2 py-1 text-left">Team</th>
                  <th className="px-2 py-1 text-center">P</th>
                  <th className="px-2 py-1 text-center">W</th>
                  <th className="px-2 py-1 text-center">D</th>
                  <th className="px-2 py-1 text-center">L</th>
                  <th className="px-2 py-1 text-center">GF</th>
                  <th className="px-2 py-1 text-center">GA</th>
                  <th className="px-2 py-1 text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row: StandingRow, idx: number) => (
                  <tr
                    key={row.idTeam}
                    className={idx % 2 === 0 ? 'bg-slate-950/40' : 'bg-slate-900/40'}
                  >
                    <td className="px-2 py-1 text-left text-slate-400">{idx + 1}</td>
                    <td className="px-2 py-1 text-left font-medium text-slate-100">{row.name}</td>
                    <td className="px-2 py-1 text-center">{row.played}</td>
                    <td className="px-2 py-1 text-center text-emerald-400">{row.win}</td>
                    <td className="px-2 py-1 text-center text-slate-300">{row.draw}</td>
                    <td className="px-2 py-1 text-center text-rose-400">{row.loss}</td>
                    <td className="px-2 py-1 text-center">{row.goalsFor}</td>
                    <td className="px-2 py-1 text-center">{row.goalsAgainst}</td>
                    <td className="px-2 py-1 text-center font-semibold">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-xs text-slate-400">No standings data available yet for this league/season.</div>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3">Top Teams by Points</h2>
          {topForChart.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topForChart} layout="vertical" margin={{ left: 40, right: 16, top: 8, bottom: 8 }}>
                  <XAxis type="number" tickLine={false} axisLine={{ stroke: '#1f2937' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={{ stroke: '#1f2937' }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1f2937' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Bar dataKey="points" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Not enough data to show points chart.</div>
          )}
        </section>
      </div>
    </div>
  );
}
