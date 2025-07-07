// Constants
import { QUAL_QUESITO_PHASES } from './constants';
// Utils
import utils from '../../utils';
import type { FirebaseStoreData, QualQuesitoPhase } from './types';
import type { Item } from '../../types/tdr';
import { keyBy } from 'lodash';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (
  currentPhase: QualQuesitoPhase,
  round: Round,
  skipTurn: boolean,
): QualQuesitoPhase => {
  const { LOBBY, SETUP, CATEGORY_CREATION, CARD_PLAY, VERIFICATION, RESULTS, GAME_OVER } =
    QUAL_QUESITO_PHASES;
  const order = [LOBBY, SETUP, CATEGORY_CREATION, CARD_PLAY, VERIFICATION, RESULTS, GAME_OVER];

  if (currentPhase === CATEGORY_CREATION && skipTurn) {
    return RESULTS;
  }

  if (currentPhase === VERIFICATION) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : CARD_PLAY;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return CARD_PLAY;
};

export const buildCardsDictFromPlayersHands = (
  players: Players,
  deckDict: Dictionary<Item>,
): Dictionary<Item> => {
  return keyBy(
    utils.players
      .getListOfPlayers(players)
      .flatMap((player) => player.hand || [])
      .map((itemId) => deckDict[itemId]),
    'id',
  );
};

export const handleSkipTurn = (store: FirebaseStoreData, players: Players, creatorId: PlayerId) => {
  players[creatorId].hand.push(...utils.game.dealItems(store.deckKeys, 1));
};
