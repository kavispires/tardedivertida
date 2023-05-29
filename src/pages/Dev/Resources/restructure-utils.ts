import { capitalize, get, has, set } from 'lodash';
import { GAMES, GLOBAL_USED_GAME_IDS, META, SKIPPED_GAMES, USERS } from './restructure-new';
import { deepCopy, removeDuplicates } from 'utils/helpers';
import { markAsDone } from './restructure-state';
import { getUserId } from './restructure-users';

export const DEFAULT_FIREBASE_USER_DB: FirebaseUserDB = {
  id: '',
  names: [],
  preferredLanguage: 'en',
  avatars: {},
  games: {},
  gender: 'unknown',
  ratings: {},
  blurredImages: {},
};

export const PLACEHOLDER_GAME_USER_ENTRY: GameUserEntry = {
  gameId: '',
  startedAt: 0,
  endedAt: 0,
  playerCount: 0,
  placement: 0,
  achievements: [],
};

export const FIREFOO_COLLECTIONS_KEY = '__collections__';

export const DEFAULT_STATE_PROPS = ['gameEndedAt', 'phase', 'round', 'winners', 'achievements'];

export const DEFAULT_STORE_PROPS = ['language', 'options', 'turnOrder', 'gameOrder'];

function generatePlayerId(playerName: PlayerName): PlayerId {
  return `_${playerName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Replace characters with accents
    .toLowerCase()}`;
}

export const createNewUser = (userId: string, name: string, language: Language): FirebaseUserDB => {
  const id = userId ? userId : generatePlayerId(name);
  const uid = getUserId(id);
  if (!has(USERS, uid)) {
    const user = deepCopy(DEFAULT_FIREBASE_USER_DB);
    user.id = uid;
    user.preferredLanguage = language;
    set(USERS, uid, user);
  }

  return get(USERS, uid);
};

export const addUsers = (players: GamePlayers, language: Language) => {
  Object.values(players).forEach((player) => {
    const user = createNewUser(player.id, player.name, language);
    player.id = user.id;
    updateUser(user, player);
  });
};

export const getUser = (id: string): FirebaseUserDB => {
  const uId = getUserId(id);
  return get(USERS, uId);
};

export const updateUser = (user: FirebaseUserDB, newData: PlainObject): FirebaseUserDB => {
  if (newData.name) {
    user.names.push(capitalize(newData.name));
  }
  if (newData.avatar) {
    if (user.avatars[newData.avatar] === undefined) {
      user.avatars[newData.avatar] = 0;
    }
    user.avatars[newData.avatar] += 1;
  }
  return user;
};

export const updateUserGameEntry = (
  user: FirebaseUserDB,
  gameName: string,
  newPlay: GameUserEntry
): FirebaseUserDB => {
  if (user.games[gameName] === undefined) {
    user.games[gameName] = {};
  }
  user.games[gameName][newPlay.gameId] = newPlay;

  return user;
};

/**
 * Add properties to players
 * @param players
 * @param properties array with property names to ne removed
 * @returns
 */
export const removePropertiesFromPlayers = (players: GamePlayers, properties: string[]): GamePlayers => {
  for (const playerId in players) {
    properties.forEach((property) => {
      delete players[playerId]?.[property];
    });
  }
  return players;
};

export const checkGameCompletion = (
  metas: Metas,
  gameId: GameId,
  fullData: any,
  state?: GameState
): boolean => {
  const isComplete = metas?.[gameId]?.isComplete || state?.phase === 'GAME_OVER' || state?.gameEndedAt;
  if (!isComplete) {
    console.log({ NOT_COMPLETE: gameId });
    set(SKIPPED_GAMES, gameId, fullData);
  }
  return Boolean(isComplete);
};

export const checkPreviouslyParsedId = (
  gameId: GameId,
  date: number,
  fullData: any,
  isComplete: boolean,
  isDuplicate: boolean,
  meta: GameMeta
): boolean => {
  const isUsed = has(GLOBAL_USED_GAME_IDS, gameId);
  if (isUsed) {
    console.log({ USED_BEFORE: gameId });
    set(SKIPPED_GAMES, gameId, fullData);
  } else {
    if (isComplete && meta && !isDuplicate) {
      set(GLOBAL_USED_GAME_IDS, gameId, date);
    }
  }

  return isUsed;
};

export const cleanupFirefooObject = (o: PlainObject) => {
  if (o && o?.[FIREFOO_COLLECTIONS_KEY] && Object.keys(o[FIREFOO_COLLECTIONS_KEY]).length === 0) {
    delete o[FIREFOO_COLLECTIONS_KEY];
  }
  return o;
};

export const cleanupPlayers = (players: GamePlayers, gameId: GameId, keepKeys: string[] = []) => {
  if (!players) {
    console.log({ NOT_PLAYERS: gameId });
    return {};
  }
  const cleanedPlayers = cleanupFirefooObject(players);
  const keys = ['avatarId', 'id', 'name', 'ready', 'score', 'updatedAt', 'type', ...keepKeys];
  Object.values(cleanedPlayers).forEach((player) => {
    if (Boolean(player?.type === 'bot') || player.id === '_a-bot' || player.id === '_b-bop') {
      delete cleanedPlayers[player.id];
    }
  });

  Object.values(cleanedPlayers).forEach((player) => {
    Object.keys(player).forEach((key) => {
      if (!keys.includes(key)) {
        delete player[key];
      }
    });
  });
  return cleanedPlayers;
};

/**
 * Remove given keys from object
 * @param o
 * @param gameId
 * @param deleteKeys
 * @returns
 */
export const stripOutObject = (o: PlainObject, gameId: GameId, deleteKeys: string[]) => {
  if (!o) {
    console.log({ NOT_OBJECT: gameId });
    return {};
  }
  const cleanObject = cleanupFirefooObject(o);
  Object.keys(cleanObject).forEach((key) => {
    if (deleteKeys.includes(key)) {
      delete cleanObject[key];
    }
  });
  return cleanObject;
};

/**
 * Only keep given keys into object
 * @param o
 * @param gameId
 * @param keepKeys
 * @returns
 */
export const stripInObject = (o: PlainObject, gameId: GameId, keepKeys: string[]) => {
  if (!o) {
    console.log({ NOT_OBJECT: gameId });
    return {};
  }
  const cleanObject = cleanupFirefooObject(o);
  const removedKeys: string[] = [];
  Object.keys(cleanObject).forEach((key) => {
    if (!keepKeys.includes(key)) {
      delete cleanObject[key];
      removedKeys.push(key);
    }
  });
  if (removedKeys.length > 0) {
    // console.log({ [`Removed keys: ${gameId}`]: removedKeys.join(', ') });
  }
  return cleanObject;
};

export const getLastUpdatedPlayerDate = (players: GamePlayers) => {
  return Math.max(...Object.values(players ?? {}).map((player) => player.updatedAt ?? 0));
};

export const makeReactKey = (o: PlainObject) => Object.keys(o).join('');

export const addPlayToPlayers = async ({
  gameName,
  gameId,
  startedAt,
  endedAt,
  players,
  winners,
  achievements,
}: SaveGameToUsersProps) => {
  // For each player, fetch data, then save

  const playersList = Object.values(players);
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
        .filter((entry) => getUserId(entry.playerId) === player.id)
        .map((entry) => entry.type as string);
    }

    const user = getUser(player.id);

    if (user) {
      // Name: keep latest name as the last one in the list

      user.names = removeDuplicates([...(user?.names ?? []), capitalize(name)].reverse()).reverse();
      // Avatars: Add one to the user avatar
      if (user.avatars[avatarId] === undefined) {
        user.avatars[avatarId] = 0;
      }
      user.avatars[avatarId] += 1;

      // Save game entry
      if (user.games[gameName] === undefined) {
        user.games[gameName] = {};
      }
      user.games[gameName][gameEntry.gameId] = gameEntry;
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

export function saveSession(key: string, meta: GameMeta, store: PlainObject, state: GameState) {
  set(META, meta.gameId, meta);
  set(GAMES, `${meta.gameName}.${meta.gameId}`, {
    store,
    state,
  });

  markAsDone(key);
}

function cleanupWinners(winners: GamePlayer[]) {
  const keys = ['avatarId', 'id', 'name', 'ready', 'score', 'updatedAt'];
  winners.forEach((player) => {
    Object.keys(player).forEach((key) => {
      if (!keys.includes(key)) {
        delete player[key];
      }
    });
    player.id = getUserId(player.id);
  });
  return winners;
}

export const getWinners = (data: PlainObject): GamePlayer[] => {
  let winners = data.state.winners;
  if (!winners) {
    if (data.state.winner && data.state.winner.length > 0 && data.state.winner?.[0]?.id) {
      winners = Array.isArray(data.state.winner) ? data.state.winner : [data.state.winner];
    } else if (data.players) {
      winners = determineWinners(data.players);
    }
  }

  return cleanupWinners(winners ?? []);
};

export const determineWinners = (players: GamePlayers): GamePlayer[] => {
  const maxScore = Math.max(...Object.values(players).map((player) => player.score));
  return Object.values(players).filter((player) => {
    return player.score === maxScore;
  });
};
