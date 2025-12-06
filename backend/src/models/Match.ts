import { mongoose } from '../db/mongo';

const MatchSchema = new mongoose.Schema(
  {
    _id: { type: Number }, // match_id from API
    league_id: { type: Number, ref: 'League' },
    season_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
    home_team_id: { type: Number, ref: 'Team' },
    away_team_id: { type: Number, ref: 'Team' },
    match_date: { type: Date, required: true },
    venue: { type: String },
    referee: { type: String },
    status: { type: String, default: 'SCHEDULED' },
    home_score: { type: Number, default: 0 },
    away_score: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  { collection: 'matches' }
);

MatchSchema.index({ match_date: 1 });
MatchSchema.index({ league_id: 1, season_id: 1 });
MatchSchema.index({ status: 1 });

export const Match = mongoose.model('Match', MatchSchema);
