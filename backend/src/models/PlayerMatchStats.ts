import { mongoose } from '../db/mongo';

const PlayerMatchStatsSchema = new mongoose.Schema(
  {
    match_id: { type: Number, ref: 'Match', required: true },
    player_id: { type: Number, ref: 'Player', required: true },
    minutes_played: { type: Number },
    goals: { type: Number },
    assists: { type: Number },
    passes: { type: Number },
    shots: { type: Number },
    tackles: { type: Number },
    heatmap_data: { type: mongoose.Schema.Types.Mixed }
  },
  { collection: 'player_match_stats' }
);

PlayerMatchStatsSchema.index({ match_id: 1 });
PlayerMatchStatsSchema.index({ player_id: 1 });

export const PlayerMatchStats = mongoose.model('PlayerMatchStats', PlayerMatchStatsSchema);
