import { useParams } from 'react-router-dom';

export function LeagueOverview() {
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">League Overview</h1>
      <p className="text-sm text-slate-400">League ID: {id}</p>
      <div className="text-xs text-slate-400">
        This page will include standings, radar charts, goals scored vs conceded, fixtures, and top scorers visualizations.
      </div>
    </div>
  );
}
