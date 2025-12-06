import { mongoose } from '../db/mongo';

const SavedVisualizationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    config: { type: mongoose.Schema.Types.Mixed, required: true },
    created_at: { type: Date, default: Date.now }
  },
  { collection: 'saved_visualizations' }
);

export const SavedVisualization = mongoose.model('SavedVisualization', SavedVisualizationSchema);
