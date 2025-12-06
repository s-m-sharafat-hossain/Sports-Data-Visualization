import { Express, Request, Response } from 'express';
import { getSoccerLeagues, getLeagueTable } from '../services/theSportsDb';

export function registerLeagueRoutes(app: Express) {
  app.get('/api/leagues', async (_req: Request, res: Response) => {
    try {
      const leagues = await getSoccerLeagues();
      res.json({ leagues });
    } catch (err) {
      console.error('Error fetching leagues', err);
      res.status(502).json({ message: 'Failed to fetch leagues from upstream API' });
    }
  });

  app.get('/api/league/:id/standings', async (req: Request, res: Response) => {
    const { id } = req.params;
    const season = (req.query.season as string) || new Date().getFullYear().toString();
    try {
      const table = await getLeagueTable(id, season);
      res.json({ leagueId: id, season, standings: table });
    } catch (err) {
      console.error('Error fetching league table', err);
      res.status(502).json({ message: 'Failed to fetch league standings from upstream API' });
    }
  });
}
