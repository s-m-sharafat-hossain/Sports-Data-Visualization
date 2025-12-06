import { mongoose } from '../db/mongo';

const MatchStatisticsSchema = new mongoose.Schema(
  {
    match_id: { type: Number, ref: 'Match', required: true },
    team_id: { type: Number, ref: 'Team', required: true },
    possession: { type: Number },
    shots_on_target: { type: Number },
    shots_off_target: { type: Number },
    passes: { type: Number },
    pass_accuracy: { type: Number },
    fouls: { type: Number },
    corners: { type: Number },
    offsides: { type: Number },
    expected_goals_xg: { type: Number }
  },
  { collection: 'match_statistics' }
);

MatchStatisticsSchema.index({ match_id: 1 });

export const MatchStatistics = mongoose.model('MatchStatistics', MatchStatisticsSchema);
