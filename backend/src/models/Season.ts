import { mongoose } from '../db/mongo';

const SeasonSchema = new mongoose.Schema(
  {
    league_id: { type: Number, ref: 'League', required: true },
    year_start: { type: Number, required: true },
    year_end: { type: Number, required: true },
    is_current: { type: Boolean, default: false }
  },
  { collection: 'seasons' }
);

export const Season = mongoose.model('Season', SeasonSchema);
