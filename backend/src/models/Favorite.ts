import { mongoose } from '../db/mongo';

const FavoriteSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    team_id: { type: Number, ref: 'Team' },
    player_id: { type: Number, ref: 'Player' },
    league_id: { type: Number, ref: 'League' },
    added_at: { type: Date, default: Date.now }
  },
  { collection: 'favorites' }
);

FavoriteSchema.index({ user_id: 1 });

export const Favorite = mongoose.model('Favorite', FavoriteSchema);
