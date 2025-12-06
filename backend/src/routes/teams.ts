import { Express, Request, Response } from 'express';
import { getLastEventsByTeam } from '../services/theSportsDb';

export function registerTeamRoutes(app: Express) {
  app.get('/api/team/:id/recent', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const events = await getLastEventsByTeam(id);
      const mapped = (events || []).map((e: any) => {
        let result: 'W' | 'D' | 'L' = 'D';
        const homeScore = e.intHomeScore ? Number(e.intHomeScore) : 0;
        const awayScore = e.intAwayScore ? Number(e.intAwayScore) : 0;
        const isHome = e.idHomeTeam === id;
        const teamScore = isHome ? homeScore : awayScore;
        const oppScore = isHome ? awayScore : homeScore;
        if (teamScore > oppScore) result = 'W';
        else if (teamScore < oppScore) result = 'L';
        return {
          id: e.idEvent,
          opponent: isHome ? e.strAwayTeam : e.strHomeTeam,
          date: e.dateEvent,
          homeScore,
          awayScore,
          isHome,
          result,
        };
      });
      res.json({ matches: mapped });
    } catch (err) {
      console.error('Error fetching team recent events', err);
      res.status(502).json({ message: 'Failed to fetch team recent matches from upstream API' });
    }
  });
}
