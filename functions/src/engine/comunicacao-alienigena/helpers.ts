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
import type { AlienAttribute, AlienItem } from '../../utils/tool-kits/alien-attributes';
import { SEPARATOR } from '../../utils/constants';
import { uniq } from 'lodash';

/**
 * Determines the next phase based on the current state and game configuration
 * @param state - The current state of the game
 * @param store - The Firebase store data
 */
export const determineNextPhase = (
  state: ComunicacaoAlienigenaState,
  store: ComunicacaoAlienigenaStore,
): string => {
  const {
    SETUP,
    ALIEN_SELECTION,
    ALIEN_SEEDING,
    HUMANS_ASKS,
    ALIEN_ANSWER,
    ALIEN_REQUEST,
    OFFERINGS,
    REVEAL,
    GAME_OVER,
  } = COMUNICACAO_ALIENIGENA_PHASES;
  const hasBot = checkIsBot(store);

  const order = [
    SETUP,
    ALIEN_SELECTION,
    HUMANS_ASKS,
    ALIEN_ANSWER,
    ALIEN_REQUEST,
    OFFERINGS,
    REVEAL,
    GAME_OVER,
  ];

  const { phase: currentPhase, round, status, items } = state;

  if (currentPhase === REVEAL) {
    if (status && (status.timeLeft < 1 || items.every((item: AlienItem) => item.offerings.length))) {
      return GAME_OVER;
    }

    if (status && status.needed <= status.found) {
      return GAME_OVER;
    }

    return round.forceLastRound ? GAME_OVER : HUMANS_ASKS;
  }

  // If bot, we need to verify unclear items
  if (currentPhase === SETUP) {
    return hasBot ? ALIEN_SEEDING : ALIEN_SELECTION;
  }

  if (currentPhase === ALIEN_SEEDING) {
    return HUMANS_ASKS;
  }

  // In a bot alien game, skip alien request and go directly to offerings
  if (currentPhase === ALIEN_ANSWER) {
    return hasBot ? OFFERINGS : ALIEN_REQUEST;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Checks if the game has an alien bot
 * @param store - The Firebase store data
 */
export const checkIsBot = (store: FirebaseStoreData) => Boolean(store?.options?.botAlien);

/**
 * Integrates player seeds into the bot knowledge
 * @param items - The array of alien items
 * @param players - The collection of players in the game
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

export function cleanupKnownSpriteIds(
  knownSpriteIds: string[],
  attributes: AlienAttribute[],
  startingAttributesIds: string[],
) {
  const startingAttributesSpriteIds = attributes
    .filter((attribute) => startingAttributesIds.includes(attribute.id))
    .map((attribute) => attribute.spriteId);

  return uniq(knownSpriteIds.filter((spriteId) => !startingAttributesSpriteIds.includes(spriteId)));
}

/**
 * Calculates and returns player achievements based on game statistics
 * @param store - The Firebase store data containing achievement counters
 * @param hasBot - Whether the game has a bot alien
 * @param playerCount - The number of players in the game
 * @param alienId - The ID of the player who was the alien
 */
export const getAchievements = (
  store: FirebaseStoreData,
  hasBot: boolean,
  playerCount: number,
  alienId: UID,
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
