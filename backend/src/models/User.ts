import { mongoose } from '../db/mongo';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    last_login: { type: Date }
  },
  { collection: 'users' }
);

export const User = mongoose.model('User', UserSchema);
