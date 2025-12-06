// Central database module: exports Mongo connection, Redis client, and all models

export { connectMongo, mongoose } from '../db/mongo';
export { redis } from '../db/redis';

export { User } from '../models/User';
export { UserSettings } from '../models/UserSettings';
export { League } from '../models/League';
export { Season } from '../models/Season';
export { Team } from '../models/Team';
export { Player } from '../models/Player';
export { Match } from '../models/Match';
export { MatchEvent } from '../models/MatchEvent';
export { MatchStatistics } from '../models/MatchStatistics';
export { PlayerMatchStats } from '../models/PlayerMatchStats';
export { Favorite } from '../models/Favorite';
export { SavedVisualization } from '../models/SavedVisualization';
