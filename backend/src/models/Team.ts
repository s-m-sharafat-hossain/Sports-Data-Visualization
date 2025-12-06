import { mongoose } from '../db/mongo';

const TeamSchema = new mongoose.Schema(
  {
    _id: { type: Number }, // team_id
    league_id: { type: Number, ref: 'League' },
    name: { type: String, required: true },
    logo_url: { type: String },
    founded: { type: Number },
    stadium: { type: String },
    stadium_capacity: { type: Number },
    country: { type: String }
  },
  { collection: 'teams' }
);

TeamSchema.index({ name: 1, league_id: 1 });

export const Team = mongoose.model('Team', TeamSchema);
