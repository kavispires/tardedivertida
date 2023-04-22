// Constants
import { GAME_NAMES } from '../../utils/constants';
import { CRUZA_PALAVRAS_ACTIONS, CRUZA_PALAVRAS_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type { CruzaPalavrasInitialState, CruzaPalavrasOptions, CruzaPalavrasSubmitAction } from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase } from './helpers';
import {
  prepareClueWritingPhase,
  prepareGuessingPhase,
  prepareGameOverPhase,
  prepareRevealPhase,
  prepareSetupPhase,
} from './setup';
import { getWords } from './data';
import { handleSubmitClue, handleSubmitGuesses } from './actions';

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
  options: CruzaPalavrasOptions
): CruzaPalavrasInitialState => {
  return utils.helpers.getDefaultInitialState<CruzaPalavrasInitialState>({
    gameId,
    gameName: GAME_NAMES.CRUZA_PALAVRAS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: CRUZA_PALAVRAS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      deck: [],
    },
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (gameName: string, gameId: string, players: Players): Promise<boolean> => {
  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    gameName,
    gameId,
    'prepare next phase'
  );

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === CRUZA_PALAVRAS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getWords(store.language, store.options?.imageGrid);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId, players);
  }

  // * -> CLUE_WRITING
  if (nextPhase === CRUZA_PALAVRAS_PHASES.CLUE_WRITING) {
    const newPhase = await prepareClueWritingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // CLUE_WRITING -> GUESSING
  if (nextPhase === CRUZA_PALAVRAS_PHASES.GUESSING) {
    const newPhase = await prepareGuessingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GUESSING -> REVEAL
  if (nextPhase === CRUZA_PALAVRAS_PHASES.REVEAL) {
    const newPhase = await prepareRevealPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === CRUZA_PALAVRAS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles clue and guesses submissions
 * May trigger next phase
 */
export const submitAction = async (data: CruzaPalavrasSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case CRUZA_PALAVRAS_ACTIONS.SUBMIT_CLUE:
      utils.firebase.validateSubmitActionProperties(data, ['clue'], 'submit category');
      return handleSubmitClue(gameName, gameId, playerId, data.clue);
    case CRUZA_PALAVRAS_ACTIONS.SUBMIT_GUESSES:
      utils.firebase.validateSubmitActionProperties(data, ['guesses'], 'submit guess');
      return handleSubmitGuesses(gameName, gameId, playerId, data.guesses);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
