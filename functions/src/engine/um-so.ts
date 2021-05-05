import { GAME_COLLECTIONS, AVATAR_IDS, UM_SO_PHASES } from '../utils/constants';
import * as gameUtils from '../utils/game-utils';
// import * as utils from '../utils/index';
import { Players, Player, ArteRuimState, GameId, PlayerName, UmSoInitialState } from '../utils/interfaces';

export const umSo = {
  /**
   * Get initial session
   * @param gameId
   * @param uid
   * @returns
   */
  getInitialSession: (gameId: GameId, uid: string): UmSoInitialState => ({
    meta: {
      gameId,
      gameName: GAME_COLLECTIONS.UM_SO,
      createdAt: Date.now(),
      createdBy: uid,
      min: 3,
      max: 8,
      isLocked: false,
      isComplete: false,
    },
    players: {},
    store: {
      usedWords: {},
      currentWords: [],
      currentSuggestions: [],
    },
    state: {
      phase: UM_SO_PHASES.LOBBY,
      round: 0,
    },
  }),
  /**
   * Creates new player object
   * @param name
   * @param players
   * @returns
   */
  createPlayer: (name: PlayerName, avatarId: string, players: Players = {}): Player => {
    const playerList = Object.values(players);
    const usedAvatars = playerList.map((player) => player.avatarId);
    avatarId = usedAvatars.includes(avatarId)
      ? gameUtils.getRandomUniqueItem(AVATAR_IDS, usedAvatars)
      : avatarId;

    return {
      name,
      avatarId,
      ready: false,
      score: 0,
      updatedAt: Date.now(),
    };
  },
  /**
   * Locks game adding isLock to meta and moving to the RULES phase
   * @param players
   * @returns
   */
  lockGame: (): ArteRuimState => {
    return {
      phase: UM_SO_PHASES.RULES,
      round: 0,
    };
  },
};
