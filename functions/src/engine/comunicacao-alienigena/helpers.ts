// Constants
import { COMUNICACAO_ALIENIGENA_ACHIEVEMENTS, COMUNICACAO_ALIENIGENA_PHASES } from './constants';
// Utils
import utils from '../../utils';
import type {
  ComunicacaoAlienigenaAchievement,
  ComunicacaoAlienigenaState,
  ComunicacaoAlienigenaStore,
  FirebaseStoreData,
} from './types';
import type { AlienItem } from '../../utils/tool-kits/alien-attributes';
import { SEPARATOR } from '../../utils/constants';

/**
 * Determine the next phase based on the current one
 * @param state
 * @param store
 * @returns
 */
export const determineNextPhase = (
  state: ComunicacaoAlienigenaState,
  store: ComunicacaoAlienigenaStore,
): string => {
  const {
    LOBBY,
    SETUP,
    ALIEN_SELECTION,
    ALIEN_SEEDING,
    HUMAN_ASK,
    ALIEN_ANSWER,
    ALIEN_REQUEST,
    OFFERINGS,
    REVEAL,
    GAME_OVER,
  } = COMUNICACAO_ALIENIGENA_PHASES;
  const hasBot = checkIsBot(store);

  const order = [LOBBY, SETUP, ALIEN_SELECTION, HUMAN_ASK, ALIEN_ANSWER, ALIEN_REQUEST, OFFERINGS, REVEAL];

  const { phase: currentPhase, round, humanId, turnOrder, status, items } = state;

  if (currentPhase === REVEAL) {
    if (status && (status.timeLeft < 1 || items.every((item: AlienItem) => item.offerings.length))) {
      return GAME_OVER;
    }

    if (status && status.needed <= status.found) {
      return GAME_OVER;
    }

    return round.forceLastRound ? GAME_OVER : HUMAN_ASK;
  }

  // If bot, we need to verify unclear items
  if (currentPhase === SETUP) {
    return hasBot ? ALIEN_SEEDING : ALIEN_SELECTION;
  }

  if (currentPhase === ALIEN_SEEDING) {
    return HUMAN_ASK;
  }

  // If the last player answer, go to alien request otherwise the next human
  // But if it's a bot alien game, skip alien request and go directly to offerings
  if (currentPhase === ALIEN_ANSWER && turnOrder) {
    const isLastHuman = turnOrder.indexOf(humanId) === turnOrder.length - 1;

    if (!isLastHuman) return HUMAN_ASK;

    return hasBot ? OFFERINGS : ALIEN_REQUEST;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return HUMAN_ASK;
};

/**
 * Check if game has an alien bot
 * @param store
 * @returns
 */
export const checkIsBot = (store: FirebaseStoreData) => Boolean(store?.options?.botAlien);

/**
 * Integrate players seeds into the bot knowledge
 */
export function applySeedsToAlienItemKnowledge(items: AlienItem[], players: Players) {
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.alienSeeds) {
      Object.entries<number>(player.alienSeeds).forEach(([itemAttributeKey, value]) => {
        const [itemId, attributeKey] = itemAttributeKey.split(SEPARATOR);
        const item = items.find((item) => item.id === itemId);
        if (item) {
          item.attributes[attributeKey] = value;
        }
      });
    }
  });
}

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (
  store: FirebaseStoreData,
  hasBot: boolean,
  playerCount: number,
  alienId: PlayerId,
) => {
  const achievements: Achievement<ComunicacaoAlienigenaAchievement>[] = [];

  if (!hasBot) {
    utils.achievements.increase(store, alienId, 'alien', 1);
  }

  const validAchievement = hasBot ? playerCount > 1 : playerCount > 2;

  const ineligiblePlayers = !hasBot ? [alienId] : [];

  const { most: mostObjects, least: fewestObjects } = utils.achievements.getMostAndLeastOf(
    store,
    'objectInquiries',
    ineligiblePlayers,
  );
  // Most Objects: used the most number of objects during inquiries
  if (mostObjects && validAchievement) {
    achievements.push({
      type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.MOST_QUESTIONED_OBJECTS,
      playerId: mostObjects.playerId,
      value: mostObjects.value,
    });
  }

  // Fewest Objects: used the fewest number of objects during inquiries
  if (fewestObjects && validAchievement) {
    achievements.push({
      type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.FEWEST_QUESTIONED_OBJECTS,
      playerId: fewestObjects.playerId,
      value: fewestObjects.value,
    });
  }

  // Most correct: guesses the correct objects more times
  const { most: correct } = utils.achievements.getMostAndLeastOf(store, 'correct', ineligiblePlayers);
  if (correct && validAchievement) {
    achievements.push({
      type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.MOST_CORRECT_OBJECTS,
      playerId: correct.playerId,
      value: correct.value,
    });
  }

  // Most cursed: guesses the cursed objects more times
  const { most: cursed } = utils.achievements.getMostAndLeastOf(store, 'cursed', ineligiblePlayers);
  if (cursed && validAchievement) {
    achievements.push({
      type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.MOST_CURSED_OBJECTS,
      playerId: cursed.playerId,
      value: cursed.value,
    });
  }

  // Most blank: guesses the blank objects more times
  const { most: blank } = utils.achievements.getMostAndLeastOf(store, 'blank', ineligiblePlayers);
  if (blank && validAchievement) {
    achievements.push({
      type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.MOST_BLANK_OBJECTS,
      playerId: blank.playerId,
      value: blank.value,
    });
  }

  if (!hasBot) {
    // Players as alien
    const { most: alien } = utils.achievements.getMostAndLeastOf(store, 'alien');
    if (alien) {
      achievements.push({
        type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.PLAYED_AS_ALIEN,
        playerId: alien.playerId,
        value: alien.value,
      });
    }
  }

  return achievements;
};
