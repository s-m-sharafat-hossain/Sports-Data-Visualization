import { useParams } from 'react-router-dom';

export function TeamAnalytics() {
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Team Analytics</h1>
      <p className="text-sm text-slate-400">Team ID: {id}</p>
      <div className="text-xs text-slate-400">
        This page will include team summary, performance charts, squad stats, and head-to-head comparison visualizations.
      </div>
    </div>
  );
}
