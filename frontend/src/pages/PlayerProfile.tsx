import { useParams } from 'react-router-dom';

export function PlayerProfile() {
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Player Profile</h1>
      <p className="text-sm text-slate-400">Player ID: {id}</p>
      <div className="text-xs text-slate-400">
        This page will show player bio, performance graphs, radar chart, heatmap, and injury history timeline.
      </div>
    </div>
  );
}
