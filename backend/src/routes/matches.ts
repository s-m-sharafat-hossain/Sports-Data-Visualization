import { Express, Request, Response } from 'express';
import { getNextEventsByLeague, getEventDetails } from '../services/theSportsDb';

export function registerMatchRoutes(app: Express) {
  // For now we treat "live" as upcoming+recent events for a league; can be extended later
  app.get('/api/matches/live', async (req: Request, res: Response) => {
    const leagueId = (req.query.leagueId as string) || '4328'; // 4328: English Premier League in TheSportsDB
    try {
      const events = await getNextEventsByLeague(leagueId);
      const matches = (events || []).map((e: any) => ({
        id: e.idEvent,
        league: e.strLeague,
        homeTeam: e.strHomeTeam,
        awayTeam: e.strAwayTeam,
        homeScore: e.intHomeScore ? Number(e.intHomeScore) : 0,
        awayScore: e.intAwayScore ? Number(e.intAwayScore) : 0,
        status: 'UPCOMING',
        kickoffTime: `${e.dateEvent}T${e.strTime}Z`
      }));
      res.json({ matches });
    } catch (err) {
      console.error('Error fetching matches', err);
      res.status(502).json({ message: 'Failed to fetch matches from upstream API' });
    }
  });

  app.get('/api/match/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const event = await getEventDetails(id);
      if (!event) {
        return res.status(404).json({ message: 'Match not found' });
      }

      const matchDetails = {
        id: event.idEvent,
        league: event.strLeague,
        homeTeam: event.strHomeTeam,
        awayTeam: event.strAwayTeam,
        score: {
          home: event.intHomeScore ? Number(event.intHomeScore) : 0,
          away: event.intAwayScore ? Number(event.intAwayScore) : 0
        },
        date: event.dateEvent,
        time: event.strTime,
        venue: event.strVenue,
        status: event.strStatus || 'SCHEDULED',
        // TODO: enrich with timeline, stats, and lineups as we add more endpoints
        raw: event
      };

      res.json(matchDetails);
    } catch (err) {
      console.error('Error fetching match details', err);
      res.status(502).json({ message: 'Failed to fetch match details from upstream API' });
    }
  });
}
