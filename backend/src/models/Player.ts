import { mongoose } from '../db/mongo';

const PlayerSchema = new mongoose.Schema(
  {
    _id: { type: Number }, // player_id
    team_id: { type: Number, ref: 'Team' },
    name: { type: String, required: true },
    nationality: { type: String },
    age: { type: Number },
    position: { type: String },
    height: { type: String },
    weight: { type: String },
    photo: { type: String }
  },
  { collection: 'players' }
);

export const Player = mongoose.model('Player', PlayerSchema);
