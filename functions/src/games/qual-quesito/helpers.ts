import { keyBy } from 'lodash';
// Types
import type { ItemData } from '../../types/tdr';
import type { QualQuesitoPhase } from './types';
// Constants
import { QUAL_QUESITO_PHASES } from './constants';
// Utils
import utils from '../../utils';

/**
 * Determines the next phase based on the current phase and skip status
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param skipTurn - Whether the current turn should be skipped
 * @param players - The collection of players in the game
 */
export const determineNextPhase = (
  currentPhase: QualQuesitoPhase,
  round: Round,
  skipTurn: boolean,
  players: Players,
): string => {
  const { SETUP, CATEGORY_CREATION, SKIP_ANNOUNCEMENT, CARD_PLAY, VERIFICATION, RESULTS, GAME_OVER } =
    QUAL_QUESITO_PHASES;
  const order = [SETUP, CATEGORY_CREATION, CARD_PLAY, VERIFICATION, RESULTS, GAME_OVER];

  if (currentPhase === CATEGORY_CREATION && skipTurn) {
    return SKIP_ANNOUNCEMENT;
  }

  if (currentPhase === SKIP_ANNOUNCEMENT) {
    return CATEGORY_CREATION;
  }

  if (currentPhase === RESULTS) {
    // If a player has no cards left, the game is over
    if (utils.players.getListOfPlayers(players).some((p) => p.hand.length === 0)) {
      return GAME_OVER;
    }

    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : CATEGORY_CREATION;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Builds a dictionary of cards from all players' hands
 * @param players - The collection of players in the game
 * @param deckDict - The dictionary of all item cards
 */
export const buildCardsDictFromPlayersHands = (
  players: Players,
  deckDict: Dictionary<ItemData>,
): Dictionary<ItemData> => {
  return keyBy(
    utils.players
      .getListOfPlayers(players)
      .flatMap((player) => player.hand || [])
      .map((itemId) => deckDict[itemId]),
    'id',
  );
};
