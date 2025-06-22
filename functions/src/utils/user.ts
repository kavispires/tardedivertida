import { getUserRef } from './firestore';
import { removeDuplicates } from './game-utils';
import { getListOfPlayers } from './players-utils';

interface GameUserEntry {
  gameName?: GameName;
  gameId: GameId;
  startedAt: number;
  endedAt: number;
  playerCount: number;
  placement: number;
  win?: boolean;
  last?: boolean;
  achievements: AchievementKey[];
}

interface GameUserStatistics {
  gameName: GameName;
  // Total game plays count
  plays: number;
  // Boolean if the game is winnable
  isWinnable: boolean;
  // Total number of wins
  win: number;
  // Total number of times in last place
  last: number;
  // Total number of unique achievements
  achievements: Record<AchievementKey, number>;
  // Total game play duration
  totalPlayDuration: number;
  // The latest game played
  latestPlay: GameUserEntry;
  // The first game played with the earliest startedAt
  firstPlay: GameUserEntry;
  // The game rating
  rating: number | null;
  // Comments
  comments?: string;
  // Average player count
  averagePlayerCount: number;
}

type AvatarId = string;
type AchievementKey = string;
type GameName = string;
type DailyEntry = {
  id: string; // Format YYYY-MM-DD
  number: number;
  victory: boolean;
  hearts: number;
  letters: string[];
};

/**
 * User database structure saved in Firestore
 */
export interface FirebaseUserDB {
  id: string;
  isAdmin?: boolean;
  isGuest?: boolean;
  preferredLanguage: Language;
  names: string[]; // unique list but most recent comes last
  gender?: string;
  avatars: Record<AvatarId, number>;
  ratings: Record<GameName, number>;
  games: Record<GameName, Record<GameId, GameUserEntry>>;
  blurredImages: Record<ImageCardId, true>;
  daily?: Dictionary<DailyEntry>;
}

interface FirebaseUIStatistics {
  // Total game plays count
  plays: number;
  // Total different games
  uniqueGamesPlayed: number;
  // Total games with end goal / are winnable
  winnableGames: number;
  // Total number of wins
  win: number;
  // Total number of times in last place
  last: number;
  // Total number of unique achievements
  achievements: number;
  // Total game play duration
  totalPlayDuration: number;
  // The latest game played
  latestPlay: GameUserEntry;
  // The first game played with the earliest startedAt
  firstPlay: GameUserEntry;
  // game with the most entries
  mostPlayedGame: GameName;
  // game with the fewest entries
  leastPlayedGame: GameName;
  // Game with the highest rating
  favoriteGame: GameName;
  // Game with the lowest rating
  leastFavoriteGame: GameName;
  // Game with most wins
  bestAtGame: GameName;
  // Game with most last
  worstAtGame: GameName;
  // Average Player Count
  averagePlayerCount: number;
}

/**
 * User interface parsed for the UI
 */
interface FirebaseUserUI {
  id: string;
  isAdmin: boolean;
  names: string[];
  language: Language;
  // Top 5 avatars
  avatars: AvatarId[];
  gender?: string;
  statistics: FirebaseUIStatistics;
  games: Record<GameName, GameUserStatistics>;
  blurredImages?: Record<ImageCardId, true>;
  today: {
    plays: number;
    win: number;
    last: number;
    achievements: number;
    duration: number;
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
 */
export const generateNewUser = (uid: string, isGuest?: boolean): FirebaseUserDB => {
  return { ...DEFAULT_FIREBASE_USER_DB, id: uid, isGuest: Boolean(isGuest) };
};

export const mergeUserData = (uid: string, userData?: FirebaseFirestore.DocumentData): FirebaseUserDB => {
  return { ...DEFAULT_FIREBASE_USER_DB, ...(userData ?? {}), id: uid };
};

const isWinnableGame = (gameName: GameName): boolean => {
  // Non-winnable games only
  return !['linhas-cruzadas', 'vamos-ao-cinema', 'ue-so-isso'].includes(gameName);
};

/**
 * Serialize user for the UI
 * @param dbUser
 * @param dailyDate - format YYYY-MM-DD
 * @returns
 */
export const serializeUser = (dbUser: FirebaseUserDB): FirebaseUserUI => {
  // Get top avatars
  const topAvatars = Object.keys(dbUser.avatars)
    .sort((a, b) => dbUser.avatars[b] - dbUser.avatars[a])
    .slice(0, 5);

  const playsStatistics: Record<GameName, GameUserStatistics> = {};

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

type SaveGameToUsersProps = {
  gameName: string;
  gameId: GameId;
  language: Language;
  startedAt: DateMilliseconds;
  players: Players;
  winners: Player[];
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
      user.names = removeDuplicates([...(user?.names ?? []), name].reverse()).reverse();
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

function getPlayersPlacement(players: Player[]): NumberDictionary {
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

async function fetchUser(id: string) {
  const user = await getUserRef().doc(id).get();

  // If the user object doesn't exist, ignore it
  if (!user.exists) {
    return null;
  }

  const data = user.data() as FirebaseUserDB;
  return mergeUserData(id, data);
}

async function saveNewUserData(id: string, data: FirebaseUserDB) {
  const userRef = getUserRef().doc(id);
  await userRef.update({ ...data });
}
