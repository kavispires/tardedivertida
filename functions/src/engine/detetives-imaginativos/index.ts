// Constants
import { GAME_NAMES } from '../../utils/constants';
import { DETETIVES_IMAGINATIVOS_ACTIONS, DETETIVES_IMAGINATIVOS_PHASES, PLAYER_COUNTS } from './constants';
// Types
import type {
  DetetivesImaginativosInitialState,
  DetetivesImaginativosOptions,
  DetetivesImaginativosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
import {
  prepareCardPlayPhase,
  prepareDefensePhase,
  prepareGameOverPhase,
  prepareRevealPhase,
  prepareSecretCluePhase,
  prepareSetupPhase,
  prepareVotingPhase,
} from './setup';
import { handleDefend, handlePlayCard, handleSubmitClue, handleSubmitVote } from './actions';
import { determineNextPhase } from './helpers';
import { getData } from './data';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (
  gameId: GameId,
  uid: string,
  language: Language,
  version: string,
  options: DetetivesImaginativosOptions
): DetetivesImaginativosInitialState => {
  return utils.helpers.getDefaultInitialState<DetetivesImaginativosInitialState>({
    gameId,
    gameName: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: DETETIVES_IMAGINATIVOS_PHASES.LOBBY,
    totalRounds: 0,
    store: {
      usedCards: [],
      gameOrder: [],
      turnOrder: [],
    },
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(players);

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);

    return getNextPhase(gameName, gameId);
  }

  // * -> SECRET_CLUE
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.SECRET_CLUE) {
    const newPhase = await prepareSecretCluePhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // SECRET_CLUE -> CARD_PLAY
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.CARD_PLAY) {
    const newPhase = await prepareCardPlayPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> DEFENSE
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.DEFENSE) {
    const newPhase = await prepareDefensePhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // DEFENSE -> VOTING
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.VOTING) {
    const newPhase = await prepareVotingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // VOTING -> REVEAL
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // REVEAL --> GAME_OVER
  if (nextPhase === DETETIVES_IMAGINATIVOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: DetetivesImaginativosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case DETETIVES_IMAGINATIVOS_ACTIONS.SUBMIT_CLUE:
      utils.firebase.validateSubmitActionProperties(data, ['clue'], 'submit clue');
      return handleSubmitClue(gameName, gameId, playerId, data.clue);
    case DETETIVES_IMAGINATIVOS_ACTIONS.PLAY_CARD:
      utils.firebase.validateSubmitActionProperties(data, ['cardId'], 'play card');
      return handlePlayCard(gameName, gameId, playerId, data.cardId);
    case DETETIVES_IMAGINATIVOS_ACTIONS.DEFEND:
      return handleDefend(gameName, gameId, playerId);
    case DETETIVES_IMAGINATIVOS_ACTIONS.SUBMIT_VOTE:
      utils.firebase.validateSubmitActionProperties(data, ['vote'], 'submit vote');
      return handleSubmitVote(gameName, gameId, playerId, data.vote);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
