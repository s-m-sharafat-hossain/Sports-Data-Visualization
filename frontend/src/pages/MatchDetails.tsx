import { useParams } from 'react-router-dom';

export function MatchDetails() {
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Match Details</h1>
      <p className="text-sm text-slate-400">Match ID: {id}</p>
      <div className="text-xs text-slate-400">
        This page will show score panel, live event timeline, possession donut, passing network graph, shot map, and lineups using
        D3 and charts.
      </div>
    </div>
  );
}
