// Constants
import { MEDIDAS_NAO_EXATAS_PHASES } from './constants';
// Utils
import utils from '../../utils';
import type { TextCard } from '../../types/tdr';
import type { FirebaseStoreData, GalleryEntry, Guess } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { LOBBY, SETUP, METRICS_BUILDING, GUESSING, RESULTS, GAME_OVER } = MEDIDAS_NAO_EXATAS_PHASES;
  const order = [LOBBY, SETUP, METRICS_BUILDING, GUESSING, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : METRICS_BUILDING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase as keyof typeof MEDIDAS_NAO_EXATAS_PHASES);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return METRICS_BUILDING;
};

export const determineResults = (
  players: Players,
  presenterId: PlayerId,
  secretWordId: CardId,
  wordsDict: Dictionary<TextCard>,
  store: FirebaseStoreData,
  metricsDescriptors: Dictionary<TextCard>,
  metrics: Record<CardId, number>,
) => {
  // Gained points: [correct, levels, presenter]
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  const result: GalleryEntry = {
    secretWordId,
    cards: wordsDict,
    metricsDescriptors,
    metrics,
  };

  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.id !== presenterId) {
      const guesses: Guess[] = player.guesses;
      const guess = guesses.at(-1)?.cardId ?? '';
      const level: number = player.level || 5;

      result.cards[guess].playersIds = result.cards[guess].playersIds ? result.cards[guess].playersIds : [];
      result.cards[guess].playersIds.push(player.id);

      const isCorrect = guess === secretWordId;
      if (isCorrect) {
        scores.add(player.id, 10, 0);
        // Reduce points by level
        scores.add(player.id, -level, 1);
        // Give points to the presenter
        scores.add(presenterId, 2, 2);
      }

      // Achievements
      if (guesses.length > 1) {
        utils.achievements.increase(store, player.id, 'doubleGuesses', 1);
      }

      switch (level) {
        case 0:
          utils.achievements.increase(store, player.id, 'level0', 1);
          break;
        case 1:
          utils.achievements.increase(store, player.id, 'level1', 1);
          break;
        case 2:
          utils.achievements.increase(store, player.id, 'level2', 1);
          break;
        case 3:
          utils.achievements.increase(store, player.id, 'level3', 1);
          break;
        case 4:
          utils.achievements.increase(store, player.id, 'level4', 1);
          break;
        case 5:
          utils.achievements.increase(store, player.id, 'level5', 1);
          break;
        default:
        // do nothing
      }
    }
  });

  return {
    ranking: scores.rank(players),
    result,
  };
};
