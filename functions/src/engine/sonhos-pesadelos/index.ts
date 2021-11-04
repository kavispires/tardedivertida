// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { PLAYER_COUNT, SONHOS_PESADELOS_PHASES, TOTAL_ROUNDS } from './constants';
// Interfaces
import { GameId, Language, Players } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import { determineGameOver, determineNextPhase } from './helpers';
import { SonhosPesadelosInitialState, SonhosPesadelosSubmitAction } from './interfaces';
import {
  prepareGameOverPhase,
  prepareResolutionPhase,
  prepareMatchPhase,
  prepareSetupPhase,
  prepareTellDreamPhase,
  prepareLastChancePhase,
} from './setup';
import { getThemes } from './data';
import { handleSubmitDreams, handleSubmitVoting } from './actions';

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
  language: Language
): SonhosPesadelosInitialState => {
  return utils.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.POLEMICA_DA_VEZ,
    uid,
    language,
    playerCount: PLAYER_COUNT,
    initialPhase: SONHOS_PESADELOS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      language,

      deck: [],
      deckIndex: -1,
    },
  });
};

export const nextSonhosPesadelosPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const { sessionRef, state, store } = await firebaseUtils.getStateAndStoreReferences(
    collectionName,
    gameId,
    actionText
  );

  // Determine if it's game over
  const isGameOver = determineGameOver(store.results);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round?.current, isGameOver);

  // RULES -> SETUP
  if (nextPhase === SONHOS_PESADELOS_PHASES.SETUP) {
    // Request data
    const additionalData = await getThemes(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);

    const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
    const newPlayers = playersDoc.data() ?? {};
    return nextSonhosPesadelosPhase(collectionName, gameId, newPlayers);
  }

  // * -> TELL_DREAM
  if (nextPhase === SONHOS_PESADELOS_PHASES.TELL_DREAM) {
    const newPhase = await prepareTellDreamPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // TELL_DREAM -> MATCH
  if (nextPhase === SONHOS_PESADELOS_PHASES.MATCH) {
    const newPhase = await prepareMatchPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // MATCH -> RESOLUTION
  if (nextPhase === SONHOS_PESADELOS_PHASES.RESOLUTION) {
    const newPhase = await prepareResolutionPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION --> LAST_CHANCE
  if (nextPhase === SONHOS_PESADELOS_PHASES.LAST_CHANCE) {
    const newPhase = await prepareLastChancePhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION --> GAME_OVER
  if (nextPhase === SONHOS_PESADELOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submit by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: SonhosPesadelosSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  firebaseUtils.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_DREAMS':
      if (!data.dreams) {
        firebaseUtils.throwException('Missing `dreams` value', 'submit dreams');
      }
      return handleSubmitDreams(collectionName, gameId, playerId, data.dreams);
    case 'SUBMIT_VOTING':
      if (!data.votes) {
        firebaseUtils.throwException('Missing `votes` value', 'submit votes');
      }
      return handleSubmitVoting(collectionName, gameId, playerId, data.votes);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
