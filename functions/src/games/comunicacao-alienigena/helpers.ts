import { uniq } from 'lodash';
// Types
import type { AlienAttribute, AlienItem } from '../../tool-kits/alien-attributes';
import type { ComunicacaoAlienigenaState, ComunicacaoAlienigenaStore, FirebaseStoreData } from './types';
// Constants
import { SEPARATOR } from '../../utils/constants';
import { COMUNICACAO_ALIENIGENA_PHASES } from './constants';
// Utils
import utils from '../../utils';

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
