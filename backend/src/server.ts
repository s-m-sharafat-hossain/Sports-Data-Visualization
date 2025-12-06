import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { registerMatchRoutes } from './routes/matches';
import { registerLeagueRoutes } from './routes/leagues';
import { registerTeamRoutes } from './routes/teams';
import { config } from './config/env';

const app = express();
const PORT = config.port;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

registerLeagueRoutes(app);
registerMatchRoutes(app);
registerTeamRoutes(app);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
