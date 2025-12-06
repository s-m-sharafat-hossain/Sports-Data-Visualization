import { mongoose } from '../db/mongo';

const UserSettingsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    theme: { type: String, default: 'dark' },
    favorite_league: { type: String },
    refresh_rate: { type: Number, default: 30 },
    language: { type: String, default: 'en' }
  },
  { collection: 'user_settings' }
);

export const UserSettings = mongoose.model('UserSettings', UserSettingsSchema);
