import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface MatchDetailsResponse {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  score: {
    home: number;
    away: number;
  };
  date: string;
  time: string;
  venue: string;
  status: string;
}

export function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState<MatchDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    const fetchMatch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<MatchDetailsResponse>(`/api/match/${id}`);
        if (!mounted) return;
        setMatch(res.data);
      } catch (err) {
        console.error('Failed to load match details', err);
        if (mounted) setError('Failed to load match');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMatch();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Match Details</h1>
          <p className="text-sm text-slate-400">Match ID: {id}</p>
        </div>
        {loading && <span className="text-xs text-emerald-400">Loading match...</span>}
      </div>

      {error && <div className="text-xs text-rose-400">{error}</div>}

      {match ? (
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">{match.league}</div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-sm text-slate-400">Home</span>
                  <span className="text-base font-semibold">{match.homeTeam}</span>
                </div>
                <div className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-950/70 font-mono text-2xl">
                  {match.score.home} - {match.score.away}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-400">Away</span>
                  <span className="text-base font-semibold">{match.awayTeam}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1 min-w-[180px]">
              <div>
                <span className="text-slate-500 mr-1">Status</span>
                <span className="px-2 py-0.5 rounded-full border border-slate-700 uppercase tracking-wide">
                  {match.status || 'SCHEDULED'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 mr-1">Date</span>
                <span>{match.date}</span>
              </div>
              <div>
                <span className="text-slate-500 mr-1">Time</span>
                <span>{match.time}</span>
              </div>
              <div>
                <span className="text-slate-500 mr-1">Venue</span>
                <span>{match.venue || 'TBD'}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Timeline, possession donut, passing network, shot map, and lineups will be rendered here using D3 and additional
            endpoints.
          </div>
        </section>
      ) : !loading && !error ? (
        <div className="text-xs text-slate-400">No match data loaded yet.</div>
      ) : null}
    </div>
  );
}
