import { GAME_COLLECTIONS, ARTE_RUIM_PHASES, AVATAR_IDS } from '../utils/constants';
import { getRandomUniqueItem } from '../utils/game-utils';
import { ArteRuimInitialState, Players, Player, ArteRuimState, StatePlayers } from '../utils/interfaces';

export const arteRuim = {
  /**
   * Get initial session
   * @param gameId
   * @param uid
   * @returns
   */
  getInitialSession: (gameId: string, uid: string): ArteRuimInitialState => ({
    meta: {
      gameId,
      gameName: GAME_COLLECTIONS.ARTE_RUIM,
      createdAt: Date.now(),
      createdBy: uid,
      min: 3,
      max: 8,
      isLocked: false,
    },
    players: {},
    store: {
      usedCards: [],
      previousDrawings: {},
    },
    state: {
      phase: ARTE_RUIM_PHASES.LOBBY,
      round: 0,
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
      lasUpdatedAt: Date.now(),
    };
  },
  /**
   * Locks game adding isLock to meta and moving to the RULES phase
   * @param players
   * @returns
   */
  lockGame: (): ArteRuimState => {
    return {
      phase: ARTE_RUIM_PHASES.RULES,
      round: 0,
    };
  },
};

export const readyPlayer = (players: StatePlayers, playerName: string): StatePlayers => {
  players[playerName].ready = true;
  return players;
};

export const unReadyPlayers = (players: StatePlayers): StatePlayers => {
  for (const player in players) {
    players[player].ready = false;
  }
  return players;
};

export const isEverybodyReady = (players: StatePlayers): boolean => {
  return Object.values(players).every((player) => player.ready);
};

export const getPointsToVictory = (players: StatePlayers, victory = 30): number => {
  const max = Object.values(players).reduce((acc, player) => {
    return Math.max(acc, player.score);
  }, 0);

  return max < victory ? victory - max : 0;
};
