import { GAME_COLLECTIONS, ARTE_RUIM_PHASES, AVATAR_IDS } from '../utils/constants';
import { getRandomUniqueItem } from '../utils/game-utils';
// import { ArteRuimInitialState, Players, Player } from '../utils/interfaces';

export interface Meta {
  id: string;
  game: string;
  createdAt: number;
  createdBy: string;
  min: number;
  max: number;
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

export interface ArteRuimInfo {
  players: Players;
}

export interface ArteRuimStore {
  usedCards: string[];
  previousDrawings: unknown;
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
};
