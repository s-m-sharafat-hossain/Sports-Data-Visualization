import { mongoose } from '../db/mongo';

const MatchEventSchema = new mongoose.Schema(
  {
    match_id: { type: Number, ref: 'Match', required: true },
    minute: { type: Number },
    type: { type: String, required: true },
    team_id: { type: Number, ref: 'Team' },
    player_id: { type: Number, ref: 'Player' },
    assist_player_id: { type: Number, ref: 'Player' },
    detail: { type: String }
  },
  { collection: 'match_events' }
);

MatchEventSchema.index({ match_id: 1 });

export const MatchEvent = mongoose.model('MatchEvent', MatchEventSchema);
