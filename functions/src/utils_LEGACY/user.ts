import { uniq } from 'lodash';
// Services
import { getUserCollectionRef } from '../services/firestore-core';
// Internal
import { getListOfPlayers } from './players-utils';

/**
 * A single game play entry for a user's game history
 */
interface GameUserEntry {
  /**
   * The name of the game
   */
  gameName?: string;
  /**
   * The unique identifier of the game instance
   */
  gameId: UID;
  /**
   * Timestamp when the game started
   */
  startedAt: number;
  /**
   * Timestamp when the game ended
   */
  endedAt: number;
  /**
   * Number of players in the game
   */
  playerCount: number;
  /**
   * The player's placement/rank in the game
   */
  placement: number;
  /**
   * Whether the player won the game
   */
  win?: boolean;
  /**
   * Whether the player finished in last place
   */
  last?: boolean;
  /**
   * Array of achievement keys earned in this game
   */
  achievements: AchievementKey[];
}

/**
 * Statistical data for a user's play history of a specific game
 */
interface GameUserStatistics {
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * Total number of times the game was played
   */
  plays: number;
  /**
   * Whether the game has a win condition
   */
  isWinnable: boolean;
  /**
   * Total number of wins
   */
  win: number;
  /**
   * Total number of times finished in last place
   */
  last: number;
  /**
   * Dictionary of unique achievements with their occurrence counts
   */
  achievements: Record<AchievementKey, number>;
  /**
   * Total duration spent playing this game in milliseconds
   */
  totalPlayDuration: number;
  /**
   * The most recently played game instance
   */
  latestPlay: GameUserEntry;
  /**
   * The first game instance played (earliest startedAt)
   */
  firstPlay: GameUserEntry;
  /**
   * The user's rating for this game
   */
  rating: number | null;
  /**
   * Optional user comments about the game
   */
  comments?: string;
  /**
   * Average number of players across all plays
   */
  averagePlayerCount: number;
}

/**
 * Unique identifier for an avatar
 */
type AvatarId = string;

/**
 * Unique key for an achievement
 */
type AchievementKey = string;

/**
 * Daily challenge entry for a user
 */
type DailyEntry = {
  /**
   * The date identifier in format YYYY-MM-DD
   */
  id: string;
  /**
   * The daily challenge number
   */
  number: number;
  /**
   * Whether the challenge was completed successfully
   */
  victory: boolean;
  /**
   * Number of hearts/lives remaining
   */
  hearts: number;
  /**
   * Array of letters used or collected
   */
  letters: string[];
};

/**
 * User database structure saved in Firestore
 */
export interface FirebaseUserDB {
  /**
   * The unique identifier of the user
   */
  id: string;
  /**
   * Whether the user has admin privileges
   */
  isAdmin?: boolean;
  /**
   * Whether the user is a guest account
   */
  isGuest?: boolean;
  /**
   * The user's preferred language
   */
  preferredLanguage: Language;
  /**
   * List of names used by the user (most recent comes last)
   */
  names: string[];
  /**
   * The user's gender preference
   */
  gender?: string;
  /**
   * Dictionary of avatars and their usage counts
   */
  avatars: Record<AvatarId, number>;
  /**
   * Dictionary of game names and their ratings
   */
  ratings: Record<string, number>;
  /**
   * Nested dictionary of games and their play entries
   */
  games: Record<string, Record<UID, GameUserEntry>>;
  /**
   * Dictionary of images the user has chosen to blur
   */
  blurredImages: Record<UID, true>;
  /**
   * Dictionary of daily challenge entries
   */
  daily?: Dictionary<DailyEntry>;
}

/**
 * Global statistics across all games for a user
 */
interface FirebaseUIStatistics {
  /**
   * Total number of games played across all games
   */
  plays: number;
  /**
   * Number of unique different games played
   */
  uniqueGamesPlayed: number;
  /**
   * Count of plays in games that have a win condition
   */
  winnableGames: number;
  /**
   * Total number of wins across all games
   */
  win: number;
  /**
   * Total number of times finished in last place across all games
   */
  last: number;
  /**
   * Total count of unique achievements earned
   */
  achievements: number;
  /**
   * Total duration spent playing all games in milliseconds
   */
  totalPlayDuration: number;
  /**
   * The most recently played game instance
   */
  latestPlay: GameUserEntry;
  /**
   * The first game instance ever played (earliest startedAt)
   */
  firstPlay: GameUserEntry;
  /**
   * Name of the game with the most play entries
   */
  mostPlayedGame: string;
  /**
   * Name of the game with the fewest play entries
   */
  leastPlayedGame: string;
  /**
   * Name of the game with the highest rating
   */
  favoriteGame: string;
  /**
   * Name of the game with the lowest rating
   */
  leastFavoriteGame: string;
  /**
   * Name of the game with the most wins
   */
  bestAtGame: string;
  /**
   * Name of the game with the most last place finishes
   */
  worstAtGame: string;
  /**
   * Average number of players across all game plays
   */
  averagePlayerCount: number;
}

/**
 * User interface parsed for the UI
 */
interface FirebaseUserUI {
  /**
   * The unique identifier of the user
   */
  id: string;
  /**
   * Whether the user has admin privileges
   */
  isAdmin: boolean;
  /**
   * List of names used by the user
   */
  names: string[];
  /**
   * The user's preferred language
   */
  language: Language;
  /**
   * Array of the top 5 most used avatar IDs
   */
  avatars: AvatarId[];
  /**
   * The user's gender preference
   */
  gender?: string;
  /**
   * Global statistics across all games
   */
  statistics: FirebaseUIStatistics;
  /**
   * Dictionary of per-game statistics
   */
  games: Record<string, GameUserStatistics>;
  /**
   * Dictionary of images the user has chosen to blur
   */
  blurredImages?: Record<UID, true>;
  /**
   * Statistics and games played today
   */
  today: {
    /**
     * Number of games played today
     */
    plays: number;
    /**
     * Number of wins today
     */
    win: number;
    /**
     * Number of last place finishes today
     */
    last: number;
    /**
     * Number of achievements earned today
     */
    achievements: number;
    /**
     * Total duration spent playing today in milliseconds
     */
    duration: number;
    /**
     * Array of all games played today
     */
    games: GameUserEntry[];
  };
}

const DEFAULT_FIREBASE_USER_DB: FirebaseUserDB = {
  id: '',
  names: [],
  avatars: {},
  preferredLanguage: 'en',
  games: {},
  gender: 'unknown',
  ratings: {},
  blurredImages: {},
};

const PLACEHOLDER_GAME_USER_ENTRY: GameUserEntry = {
  gameId: '',
  startedAt: 0,
  endedAt: 0,
  playerCount: 0,
  placement: 0,
  achievements: [],
};

/**
 * Generates a brand new user with given uid
 * @param uid - The unique identifier for the user
 * @param isGuest - Whether the user is a guest account
 */
export const generateNewUser = (uid: string, isGuest?: boolean): FirebaseUserDB => {
  return { ...DEFAULT_FIREBASE_USER_DB, id: uid, isGuest: Boolean(isGuest) };
};

/**
 * Merges provided user data with default user structure
 * @param uid - The unique identifier for the user
 * @param userData - Existing user data from Firestore
 */
export const mergeUserData = (uid: string, userData?: FirebaseFirestore.DocumentData): FirebaseUserDB => {
  return { ...DEFAULT_FIREBASE_USER_DB, ...(userData ?? {}), id: uid };
};

const isWinnableGame = (gameName: string): boolean => {
  // Non-winnable games only
  return !['linhas-cruzadas', 'vamos-ao-cinema', 'ue-so-isso'].includes(gameName);
};

/**
 * Serializes user database data for the UI
 * @param dbUser - The user database object to serialize
 */
export const serializeUser = (dbUser: FirebaseUserDB): FirebaseUserUI => {
  // Get top avatars
  const topAvatars = Object.keys(dbUser.avatars)
    .sort((a, b) => dbUser.avatars[b] - dbUser.avatars[a])
    .slice(0, 5);

  const playsStatistics: Record<string, GameUserStatistics> = {};

  const today = Date.now() - 24 * 60 * 60 * 1000;
  const todaysGames: GameUserEntry[] = [];

  // Build each game collection statistics
  Object.entries(dbUser.games).forEach(([gameName, gameEntries]) => {
    const isWinnable = isWinnableGame(gameName);
    const gameAchievements: Record<AchievementKey, number> = {};
    let earliestPlaySession = 0;
    let latestPlaySession = 0;
    let playersCounts = 0;

    if (playsStatistics[gameName] === undefined) {
      playsStatistics[gameName] = {
        gameName,
        plays: 0,
        isWinnable,
        win: 0,
        last: 0,
        achievements: {},
        totalPlayDuration: 0,
        latestPlay: PLACEHOLDER_GAME_USER_ENTRY,
        firstPlay: PLACEHOLDER_GAME_USER_ENTRY,
        rating: 0,
        averagePlayerCount: 0,
      };
    }

    const entry = playsStatistics[gameName];

    Object.values(gameEntries).forEach((gEntry) => {
      const gameEntry = { gameName, ...gEntry };
      entry.plays += 1;

      // Counts
      if (gameEntry.win) {
        entry.win += 1;
      }

      if (gameEntry.last) {
        entry.last += 1;
      }

      const duration = gameEntry.endedAt - gameEntry.startedAt;
      entry.totalPlayDuration += duration;

      if (!earliestPlaySession || earliestPlaySession > gameEntry.startedAt) {
        earliestPlaySession = gameEntry.startedAt;
        entry.firstPlay = gameEntry;
      }

      if (latestPlaySession < gameEntry.startedAt) {
        latestPlaySession = gameEntry.startedAt;
        entry.latestPlay = gameEntry;
      }

      // Achievements
      if (gameEntry.achievements.length) {
        gameEntry.achievements.forEach((achievementKey) => {
          if (gameAchievements[achievementKey] === undefined) {
            gameAchievements[achievementKey] = 0;
          }
          gameAchievements[achievementKey] += 1;
        });
      }

      // Rating
      entry.rating = dbUser?.ratings?.[gameName] ?? 0;

      // Player count
      playersCounts += gameEntry.playerCount;

      // Today Games
      if (gEntry.endedAt > today) {
        todaysGames.push({ ...gameEntry, gameName: gameName });
      }
    });

    entry.achievements = gameAchievements;
    entry.averagePlayerCount = playersCounts / entry.plays;
  });

  // Build global play statistics
  const globalStatistics: FirebaseUIStatistics = {
    plays: 0,
    uniqueGamesPlayed: Object.values(playsStatistics).length,
    winnableGames: 0,
    win: 0,
    last: 0,
    achievements: 0,
    totalPlayDuration: 0,
    latestPlay: PLACEHOLDER_GAME_USER_ENTRY,
    firstPlay: PLACEHOLDER_GAME_USER_ENTRY,
    mostPlayedGame: '',
    leastPlayedGame: '',
    favoriteGame: '',
    leastFavoriteGame: '',
    bestAtGame: '',
    worstAtGame: '',
    averagePlayerCount: 0,
  };

  let earliestPlay = 0;
  let latestPlay = 0;
  let mostPlaysCount = 0;
  let fewestPlaysCount = 0;
  let highestRating = 0;
  let lowestRating = 0;
  let mostWins = 0;
  let mostLasts = 0;
  let playerCounts = 0;

  Object.values(playsStatistics).forEach((play) => {
    globalStatistics.plays += play.plays;
    if (play.isWinnable) {
      globalStatistics.winnableGames += play.plays;
    }
    globalStatistics.win += play.win;
    globalStatistics.last += play.last;
    globalStatistics.achievements += Object.keys(play.achievements).length;
    globalStatistics.totalPlayDuration += play.totalPlayDuration;
    playerCounts += play.averagePlayerCount;

    if (!earliestPlay || earliestPlay > play.firstPlay.startedAt) {
      earliestPlay = play.firstPlay.startedAt;
      globalStatistics.firstPlay = play.firstPlay;
    }

    if (latestPlay < play.latestPlay.startedAt) {
      latestPlay = play.latestPlay.startedAt;
      globalStatistics.latestPlay = play.latestPlay;
    }

    if (!fewestPlaysCount || fewestPlaysCount > play.plays) {
      fewestPlaysCount = play.plays;
      globalStatistics.leastPlayedGame = play.gameName;
    }

    if (mostPlaysCount < play.plays) {
      mostPlaysCount = play.plays;
      globalStatistics.mostPlayedGame = play.gameName;
    }

    if (!lowestRating || lowestRating > (play?.rating ?? 0)) {
      lowestRating = play?.rating ?? 0;
      globalStatistics.leastFavoriteGame = play.gameName;
    }

    if (!highestRating || highestRating < (play?.rating ?? 0)) {
      highestRating = play?.rating ?? 0;
      globalStatistics.favoriteGame = play.gameName;
    }

    if (!mostWins || mostWins > play.win) {
      mostWins = play.win;
      globalStatistics.bestAtGame = play.gameName;
    }

    if (mostLasts < play.last) {
      mostLasts = play.last;
      globalStatistics.worstAtGame = play.gameName;
    }
  });

  // Average player count
  globalStatistics.averagePlayerCount =
    playerCounts > 0 ? playerCounts / Object.values(playsStatistics).length : 0;

  // Today
  const todaySummary = {
    plays: todaysGames.length,
    win: todaysGames.filter((game) => game.win).length,
    last: todaysGames.filter((game) => game.last).length,
    achievements: todaysGames.reduce((acc, game) => acc + game.achievements.length, 0),
    duration: todaysGames.reduce((acc, game) => acc + (game.endedAt - game.startedAt), 0),
    games: todaysGames,
  };

  return {
    id: dbUser.id,
    names: dbUser?.names ?? [],
    isAdmin: !!dbUser.isAdmin,
    language: dbUser.preferredLanguage ?? 'en',
    avatars: topAvatars,
    statistics: globalStatistics,
    games: playsStatistics,
    today: todaySummary,
  };
};

/**
 * Properties for saving a completed game to user profiles
 */
type SaveGameToUsersProps = {
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * The unique identifier of the game instance
   */
  gameId: UID;
  /**
   * The language the game was played in
   */
  language: Language;
  /**
   * Timestamp when the game started
   */
  startedAt: DateMilliseconds;
  /**
   * Dictionary of all players in the game
   */
  players: Players;
  /**
   * Array of players who won the game
   */
  winners: Player[];
  /**
   * Array of achievements earned during the game
   */
  achievements: Achievement<unknown>[];
};

export const saveGameToUsers = async ({
  gameName,
  gameId,
  startedAt,
  players,
  language,
  winners,
  achievements,
}: SaveGameToUsersProps) => {
  const endedAt = Date.now();

  // For each player, fetch data, then save

  const playersList = getListOfPlayers(players);
  const playerCount = playersList.length;
  const placements = getPlayersPlacement(playersList);
  const lastPlace = Math.max(...Object.values(placements));

  for (const player of playersList) {
    const { name, avatarId } = player;
    const isWinner = winners.findIndex((p) => p.id === player.id) !== -1;

    const placement = placements[player.id];
    const gameEntry: GameUserEntry = {
      gameId,
      startedAt,
      endedAt,
      playerCount,
      placement,
      win: isWinner,
      last: lastPlace !== 1 && placement === lastPlace,
      achievements: [],
    };

    if (achievements.length > 0) {
      gameEntry.achievements = achievements
        .filter((entry) => entry.playerId === player.id)
        .map((entry) => entry.type as string);
    }

    // Get each user
    let user: FirebaseUserDB | null = null;
    try {
      user = await fetchUser(player.id);
    } catch (_) {
      // do nothing
    }

    if (user) {
      // Name: keep latest name as the last one in the list
      user.names = uniq([...(user?.names ?? []), name].reverse()).reverse();
      // Avatars: Add one to the user avatar
      if (user.avatars[avatarId] === undefined) {
        user.avatars[avatarId] = 0;
      }
      user.avatars[avatarId] += 1;

      user.preferredLanguage = language ?? 'en';

      // Save game entry
      if (user.games[gameName] === undefined) {
        user.games[gameName] = {};
      }
      user.games[gameName][gameEntry.gameId] = gameEntry;

      // Save each user
      try {
        await saveNewUserData(player.id, user);
      } catch (_) {
        // do nothing
      }
    }
  }
};

/**
 * Calculates player placements based on their scores
 * @param players - Array of players to rank
 * @returns Dictionary mapping player IDs to their placement ranks
 */
function getPlayersPlacement(players: Player[]): Dictionary<number> {
  // Sort players by score in descending order
  const sortedPlayers = players.sort((a, b) => b.score - a.score);

  // Initialize an object to hold the player rankings
  const rankings: { [key: string]: number } = {};

  // Loop through sorted players and assign rankings
  let rank = 1;
  for (let i = 0; i < sortedPlayers.length; i++) {
    // Check if this player has the same score as the previous player
    if (i > 0 && sortedPlayers[i].score === sortedPlayers[i - 1].score) {
      // If so, they share the same rank as the previous player
      rankings[sortedPlayers[i].id] = rankings[sortedPlayers[i - 1].id];
    } else {
      // Otherwise, assign the next rank
      rankings[sortedPlayers[i].id] = rank;
    }
    rank++;
  }

  return rankings;
}

/**
 * Fetches a user document from Firestore by user ID
 * @param id - The user ID to fetch
 * @returns The user data or null if user doesn't exist
 */
/**
 * Fetches a user document from Firestore by user ID
 * @param id - The user ID to fetch
 * @returns The user data or null if user doesn't exist
 */
async function fetchUser(id: string) {
  const user = await getUserCollectionRef().doc(id).get();

  // If the user object doesn't exist, ignore it
  if (!user.exists) {
    return null;
  }

  const data = user.data() as FirebaseUserDB;
  return mergeUserData(id, data);
}

/**
 * Saves updated user data to Firestore
 * @param id - The user ID to update
 * @param data - The user data to save
 */
async function saveNewUserData(id: string, data: FirebaseUserDB) {
  const userRef = getUserCollectionRef().doc(id);
  await userRef.update({ ...data });
}
