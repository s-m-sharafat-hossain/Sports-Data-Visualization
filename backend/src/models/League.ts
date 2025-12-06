import { mongoose } from '../db/mongo';

const LeagueSchema = new mongoose.Schema(
  {
    _id: { type: Number }, // league_id
    name: { type: String, required: true },
    country: { type: String },
    logo_url: { type: String }
  },
  { collection: 'leagues' }
);

export const League = mongoose.model('League', LeagueSchema);
