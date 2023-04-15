interface GameUserEntry {
  gameId: GameId;
  playedAt: number;
  playerCount: number;
  placement: number;
  win?: boolean;
  last?: boolean;
  rating: number;
}

type AvatarId = string;
type AchievementKey = string;
type GameName = string;

interface FirebaseUserDB {
  id: string;
  isAdmin?: boolean;
  names: string[]; // unique list but most recent comes last
  avatars: Record<AvatarId, number>;
  games: Record<GameName, GameUserEntry>;
  achievements: Record<GameName, AchievementKey[]>;
}

interface FirebaseUserUI {
  id: string;
  isAdmin: boolean;
  avatars: AvatarId[]; // top 3 avatars only
  gamesPlayed: number;
  statistics: {
    win: number; // absolute number
    last: number; // absolute number
    games: number; // total absolute number
    uniqueGames: number; // Object.keys(games).length
    achievements: number; // Total unique achievements
  };
  games: Record<GameName, GameUserEntry[]>;
  achievements: Record<GameName, Record<AchievementKey, number>[]>;
}

const DEFAULT_FIREBASE_USER_DB: FirebaseUserDB = {
  id: '',
  names: [],
  avatars: {},
  games: {},
  achievements: {},
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
//   achievements: {},
// };

/**
 * Generates a brand new user with given uid
 */
export const generateNewUser = (uid: string): FirebaseUserDB => {
  return { ...DEFAULT_FIREBASE_USER_DB, id: uid };
};

export const mergeUserData = (uid: string, userData?: FirebaseFirestore.DocumentData): FirebaseUserDB => {
  return { ...DEFAULT_FIREBASE_USER_DB, ...userData, id: uid };
};

export const serializeUser = (dbUser: FirebaseUserDB): FirebaseUserUI => {
  const avatars = Object.keys(dbUser.avatars)
    .sort((a, b) => dbUser.avatars[b] - dbUser.avatars[a])
    .slice(0, 3);
  const games: Record<GameName, GameUserEntry[]> = {};
  const achievements: Record<GameName, Record<AchievementKey, number>[]> = {};
  let win = 0;
  let last = 0;
  let uniqueGames = 0;
  let achievementsCount = 0;

  Object.values(dbUser.games).forEach((game) => {
    if (!games[game.gameId]) {
      games[game.gameId] = [];
      uniqueGames++;
    }
    games[game.gameId].push(game);

    if (game.win) {
      win++;
    }
    if (game.last) {
      last++;
    }
  });

  Object.entries(dbUser.achievements).forEach(([gameName, achievementKeys]) => {
    achievements[gameName] = [];
    achievementKeys.forEach((achievementKey) => {
      const count =
        games[gameName]?.filter((game) => game.win && game.playedAt >= dbUser.avatars[achievementKey])
          .length || 0;
      achievements[gameName].push({ [achievementKey]: count });
      achievementsCount += count;
    });
  });

  return {
    id: dbUser.id,
    isAdmin: !!dbUser.isAdmin,
    avatars,
    gamesPlayed: Object.values(dbUser.games).length,
    statistics: {
      win,
      last,
      games: Object.keys(dbUser.games).length,
      uniqueGames,
      achievements: achievementsCount,
    },
    games,
    achievements,
  };
};
