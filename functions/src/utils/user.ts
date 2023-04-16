import { getUserRef } from './firebase';
import { removeDuplicates } from './game-utils';
import { getListOfPlayers } from './players-utils';

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
  isGuest?: boolean;
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

type SaveGameToUsersProps = {
  gameName: string;
  gameId: GameId;
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
      last: placement === lastPlace,
      rating: 0,
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

      // Save game entry
      if (user.games[gameName] === undefined) {
        user.games[gameName] = [];
      }
      user.games[gameName].push(gameEntry);

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
