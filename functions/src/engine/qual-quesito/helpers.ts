// Constants
import { QUAL_QUESITO_ACHIEVEMENTS, QUAL_QUESITO_PHASES } from './constants';
// Utils
import utils from '../../utils';
import type { FirebaseStoreData, QualQuesitoAchievement, QualQuesitoPhase } from './types';
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
  players: Players,
): QualQuesitoPhase => {
  const { LOBBY, SETUP, CATEGORY_CREATION, SKIP_ANNOUNCEMENT, CARD_PLAY, VERIFICATION, RESULTS, GAME_OVER } =
    QUAL_QUESITO_PHASES;
  const order = [LOBBY, SETUP, CATEGORY_CREATION, CARD_PLAY, VERIFICATION, RESULTS, GAME_OVER];

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

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return CATEGORY_CREATION;
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

// export const handleSkipTurn = (store: FirebaseStoreData, players: Players, creatorId: PlayerId) => {
//   players[creatorId].hand.push(...utils.game.dealItems(store.deckKeys, 1));
// };

/**
 * Get achievements:
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<QualQuesitoAchievement>[] = [];

  // Most creator extra cards
  const { most: mostCreatorExtraCards } = utils.achievements.getMostAndLeastOf(store, 'creatorExtraCards');
  if (mostCreatorExtraCards) {
    achievements.push({
      type: QUAL_QUESITO_ACHIEVEMENTS.MOST_CREATOR_EXTRA_CARDS,
      playerId: mostCreatorExtraCards.playerId,
      value: mostCreatorExtraCards.value,
    });
  }

  // Most participation
  const { most: mostParticipation, least: leastParticipation } = utils.achievements.getMostAndLeastOf(
    store,
    'participation',
  );
  if (mostParticipation) {
    achievements.push({
      type: QUAL_QUESITO_ACHIEVEMENTS.MOST_PARTICIPATION,
      playerId: mostParticipation.playerId,
      value: mostParticipation.value,
    });
  }
  if (leastParticipation) {
    achievements.push({
      type: QUAL_QUESITO_ACHIEVEMENTS.LEAST_PARTICIPATION,
      playerId: leastParticipation.playerId,
      value: leastParticipation.value,
    });
  }

  // Most rejections
  const { most: mostRejections, least: fewestRejections } = utils.achievements.getMostAndLeastOf(
    store,
    'rejections',
  );
  if (mostRejections) {
    achievements.push({
      type: QUAL_QUESITO_ACHIEVEMENTS.MOST_REJECTIONS,
      playerId: mostRejections.playerId,
      value: mostRejections.value,
    });
  }
  if (fewestRejections) {
    achievements.push({
      type: QUAL_QUESITO_ACHIEVEMENTS.FEWEST_REJECTIONS,
      playerId: fewestRejections.playerId,
      value: fewestRejections.value,
    });
  }

  // Best creator
  const { most: bestCreator, least: worstCreator } = utils.achievements.getMostAndLeastOf(store, 'joiners');
  if (bestCreator) {
    achievements.push({
      type: QUAL_QUESITO_ACHIEVEMENTS.BEST_CREATOR,
      playerId: bestCreator.playerId,
      value: bestCreator.value,
    });
  }
  if (worstCreator) {
    achievements.push({
      type: QUAL_QUESITO_ACHIEVEMENTS.WORST_CREATOR,
      playerId: worstCreator.playerId,
      value: worstCreator.value,
    });
  }

  // Most skips
  const { most: mostSkips } = utils.achievements.getMostAndLeastOf(store, 'skipTurn');
  if (mostSkips) {
    achievements.push({
      type: QUAL_QUESITO_ACHIEVEMENTS.MOST_SKIPS,
      playerId: mostSkips.playerId,
      value: mostSkips.value,
    });
  }

  // Most accepting
  const { most: mostAccepting } = utils.achievements.getMostAndLeastOf(store, 'accepting');
  if (mostAccepting) {
    achievements.push({
      type: QUAL_QUESITO_ACHIEVEMENTS.MOST_ACCEPTING,
      playerId: mostAccepting.playerId,
      value: mostAccepting.value,
    });
  }

  // Most declining
  const { most: mostDeclining } = utils.achievements.getMostAndLeastOf(store, 'declining');
  if (mostDeclining) {
    achievements.push({
      type: QUAL_QUESITO_ACHIEVEMENTS.MOST_DECLINING,
      playerId: mostDeclining.playerId,
      value: mostDeclining.value,
    });
  }

  return achievements;
};
