interface GameUserEntry {
  gameId: GameId;
  startedAt: number;
  endedAt: number;
  playerCount: number;
  placement: number;
  win?: boolean;
  last?: boolean;
  rating: number;
  achievements: AchievementKey[];
}

type AvatarId = string;
type AchievementKey = string;
type GameName = string;

interface FirebaseUserDB {
  id: string;
  isAdmin?: boolean;
  names: string[]; // unique list but most recent comes last
  gender?: string;
  avatars: Record<AvatarId, number>;
  games: Record<GameName, GameUserEntry[]>;
  blurredImages: Record<ImageCardId, true>;
}

interface FirebaseUserUI {
  id: string;
  isAdmin: boolean;
  names: string[];
  // Top 3 avatars
  avatars: AvatarId[];
  gender?: string;
  statistics: {
    // Total game plays count
    gamesPlayed: number;
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
    // The last time a game was played
    lastPlay: number;
    // Total game play duration
    totalPlayDuration: number;
  };
  games: Record<GameName, GameUserEntry[]>;
  // achievements: Record<GameName, Record<AchievementKey, number>[]>;
  blurredImages?: Record<ImageCardId, true>;
}

const DEFAULT_FIREBASE_USER_DB: FirebaseUserDB = {
  id: '',
  names: [],
  avatars: {},
  games: {},
  gender: 'unknown',
  blurredImages: {},
};

// const DEFAULT_SERIALIZED_USER: FirebaseUserUI = {
//   id: '',
//   isAdmin: false,
//   avatars: [],
//   gamesPlayed: 0,
//   statistics: {
//     win: 0,
//     last: 0,
//     games: 0,
//     uniqueGames: 0,
//     achievements: 0,
//   },
//   games: {},
// };

/**
 * Generates a brand new user with given uid
 */
export const generateNewUser = (uid: string): FirebaseUserDB => {
  return { ...DEFAULT_FIREBASE_USER_DB, id: uid };
};

export const mergeUserData = (uid: string, userData?: FirebaseFirestore.DocumentData): FirebaseUserDB => {
  return { ...DEFAULT_FIREBASE_USER_DB, ...(userData ?? {}), id: uid };
};

const isWinnableGame = (gameName: GameName): boolean => {
  // Non-winnable games only
  return !['linhas-cruzadas', 'ue-so-isso'].includes(gameName);
};

export const serializeUser = (dbUser: FirebaseUserDB): FirebaseUserUI => {
  // Get top avatars
  const topAvatars = Object.keys(dbUser.avatars)
    .sort((a, b) => dbUser.avatars[b] - dbUser.avatars[a])
    .slice(0, 3);

  // Statistics
  let gamesPlayed = 0;
  let winnableGames = 0;
  let win = 0;
  let last = 0;
  let lastPlay = 0;
  let totalPlayDuration = 0;
  let achievementsCount = 0;

  Object.entries(dbUser.games).forEach(([gameName, gameEntries]) => {
    const isWinnable = isWinnableGame(gameName);
    const gameAchievements: Record<AchievementKey, true> = {};
    gameEntries.forEach((gameEntry) => {
      gamesPlayed += 1;

      // Win and last counts
      if (isWinnable) {
        winnableGames += 1;

        if (gameEntry.win) {
          win += 1;
        }

        if (gameEntry.last) {
          last += 1;
        }
      }

      // Duration
      lastPlay = lastPlay < gameEntry.endedAt ? gameEntry.endedAt : lastPlay;
      totalPlayDuration += gameEntry.endedAt - gameEntry.startedAt;

      // Achievements
      gameEntry.achievements.forEach((achievementKey) => {
        gameAchievements[achievementKey] = true;
      });
    });

    achievementsCount += Object.keys(gameAchievements).length;
  });

  // TODO: Parse games into statistics

  return {
    id: dbUser.id,
    names: dbUser?.names ?? [],
    isAdmin: !!dbUser.isAdmin,
    avatars: topAvatars,
    statistics: {
      gamesPlayed,
      uniqueGamesPlayed: Object.values(dbUser.games).length,
      winnableGames,
      win,
      last,
      achievements: achievementsCount,
      lastPlay,
      totalPlayDuration,
    },
    games: dbUser.games,
  };
};
