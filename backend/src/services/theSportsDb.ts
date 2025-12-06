import axios from 'axios';
import { config } from '../config/env';
import { getCache, setCache } from '../cache/memoryCache';
import { redis } from '../db/redis';

const TTL_SHORT = 30_000; // 30 seconds for live-like data
const TTL_LONG = 5 * 60_000; // 5 minutes for standings, leagues etc.

function buildUrl(path: string) {
  const apiKey = config.theSportsDb.apiKey || '1'; // '1' is TheSportsDB test key with limited data
  return `${config.theSportsDb.baseUrl}/${apiKey}/${path}`;
}

async function fetchWithCache<T>(cacheKey: string, path: string, ttl: number): Promise<T> {
  // 1) Try Redis (cross-instance cache)
  try {
    const redisVal = await redis.get(cacheKey);
    if (redisVal) {
      return JSON.parse(redisVal) as T;
    }
  } catch (err) {
    // Redis failure should not break the app; fall back to memory+API
    console.error('Redis get error for key', cacheKey, err);
  }

  // 2) Try in-process memory cache
  const cached = getCache<T>(cacheKey);
  if (cached) return cached;

  // 3) Fetch from upstream API
  const url = buildUrl(path);
  const res = await axios.get<T>(url);

  // 4) Store in memory cache
  setCache(cacheKey, res.data, ttl);

  // 5) Store in Redis for other instances
  try {
    await redis.set(cacheKey, JSON.stringify(res.data), 'PX', ttl);
  } catch (err) {
    console.error('Redis set error for key', cacheKey, err);
  }

  return res.data;
}

// Example: popular soccer leagues list (hard-coded IDs used by TheSportsDB)
export async function getSoccerLeagues() {
  // TheSportsDB provides league lists, but we can start with a fixed set to ensure stability
  const data = await fetchWithCache<any>('leagues_soccer_featured', 'search_all_leagues.php?s=Soccer', TTL_LONG);
  return (data?.countries || []).map((l: any) => ({
    id: l.idLeague,
    name: l.strLeague,
    sport: l.strSport,
    country: l.strCountry
  }));
}

export async function getLeagueTable(leagueId: string, season: string) {
  // https://www.thesportsdb.com/api/v1/json/{APIKEY}/lookuptable.php?l={league_id}&s={season}
  const data = await fetchWithCache<any>(`league_table_${leagueId}_${season}`, `lookuptable.php?l=${leagueId}&s=${season}`, TTL_LONG);
  return data?.table || [];
}

export async function getNextEventsByLeague(leagueId: string) {
  // Upcoming events
  const data = await fetchWithCache<any>(`league_next_${leagueId}`, `eventsnextleague.php?id=${leagueId}`, TTL_SHORT);
  return data?.events || [];
}

export async function getLastEventsByTeam(teamId: string) {
  const data = await fetchWithCache<any>(`team_last_${teamId}`, `eventslast.php?id=${teamId}`, TTL_LONG);
  return data?.results || [];
}

export async function getEventDetails(eventId: string) {
  const data = await fetchWithCache<any>(`event_${eventId}`, `lookupevent.php?id=${eventId}`, TTL_SHORT);
  return (data?.events || [])[0] || null;
}
