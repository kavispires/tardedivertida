import { GAME_COLLECTIONS, ARTE_RUIM_PHASES, AVATAR_IDS } from '../utils/constants';
import { getRandomUniqueItem } from '../utils/game-utils';
// import { ArteRuimInitialState, Players, Player } from '../utils/interfaces';

export interface BasicObject {
  [key: string]: any;
}

export interface Meta {
  id: string;
  game: string;
  createdAt: number;
  createdBy: string;
  min: number;
  max: number;
}

export interface InfoPlayer {
  avatarId: string;
  name: string;
  [key: string]: any;
}

export interface StatePlayer {
  name: string;
  ready: boolean;
  score: number;
  [key: string]: any;
}

export interface Player {
  avatarId: string;
  name: string;
  ready: boolean;
  score: number;
}

export interface Players {
  [key: string]: Player;
}

export interface InfoPlayers {
  [key: string]: InfoPlayer;
}

export interface StatePlayers {
  [key: string]: StatePlayer;
}

export interface ArteRuimInfo {
  players: InfoPlayers;
  isLocked: boolean;
  [key: string]: any;
}

export interface ArteRuimStore {
  usedCards: string[];
  previousDrawings: any;
  [key: string]: any;
}

export interface ArteRuimState {
  phase: string;
  [key: string]: any;
}

export interface ArteRuimInitialState {
  meta: Meta;
  info: ArteRuimInfo;
  store: ArteRuimStore;
  state: ArteRuimState;
}

export const arteRuim = {
  /**
   * Get initial session
   * @param gameId
   * @param uid
   * @returns
   */
  getInitialSession: (gameId: string, uid: string): ArteRuimInitialState => ({
    meta: {
      id: gameId,
      game: GAME_COLLECTIONS.ARTE_RUIM,
      createdAt: Date.now(),
      createdBy: uid,
      min: 3,
      max: 8,
    },
    info: {
      players: {},
      isLocked: false,
    },
    store: {
      usedCards: [],
      previousDrawings: {},
    },
    state: {
      phase: ARTE_RUIM_PHASES.LOBBY,
      players: {},
    },
  }),
  /**
   * Creates new player object
   * @param name
   * @param players
   * @returns
   */
  createPlayer: (name: string, avatarId: string, players: Players = {}): Player => {
    const playerList = Object.values(players);
    const usedAvatars = playerList.map((player) => player.avatarId);
    avatarId = usedAvatars.includes(avatarId) ? getRandomUniqueItem(AVATAR_IDS, usedAvatars) : avatarId;

    return {
      name,
      avatarId,
      ready: true,
      score: 0,
    };
  },
  lockGame: (players: Players): { info: ArteRuimInfo; state: ArteRuimState } => {
    const playersArray = Object.entries(players);

    const infoPlayers = playersArray.reduce((acc, [key, player]) => {
      const infoPlayer: InfoPlayer = {
        name: player.name,
        avatarId: player.avatarId,
      };
      acc[key] = infoPlayer;
      return acc;
    }, <InfoPlayers>{});

    const statePlayers = playersArray.reduce((acc, [key, player]) => {
      const statePlayer: StatePlayer = {
        name: player.name,
        ready: false,
        score: 0,
      };
      acc[key] = statePlayer;
      return acc;
    }, <StatePlayers>{});

    return {
      info: {
        players: infoPlayers,
        isLocked: true,
      },
      state: {
        phase: ARTE_RUIM_PHASES.RULES,
        players: statePlayers,
      },
    };
  },
};
