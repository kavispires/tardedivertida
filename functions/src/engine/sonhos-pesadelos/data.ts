// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { NamingPromptCard } from '../../types/tdr';
import type { ResourceData, SonhosPesadelosCards } from './types';
// Helpers
import * as resourceUtils from '../resource';
import utils from '../../utils';
import { IMAGE_CARDS_PER_ROUND, TOTAL_ROUNDS } from './constants';

/**
 * Get theme cards resource based on the game's language
 * @param language
 * @returns
 */
export const getInspirationThemes = async (language: string): Promise<ResourceData> => {
  const cardsResponse = await resourceUtils.fetchResource<Dictionary<NamingPromptCard>>(
    TDR_RESOURCES.NAMING_PROMPTS,
    language,
  );
  const cards = Object.values(cardsResponse);

  // Get images
  const images = await utils.imageCards.getImageCards(TOTAL_ROUNDS * IMAGE_CARDS_PER_ROUND);

  const leveledCards = Object.values(cards).reduce(
    (acc: SonhosPesadelosCards, entry) => {
      acc[entry.level].push(entry);
      return acc;
    },
    {
      2: [],
      3: [],
      4: [],
    },
  );

  return {
    cards: leveledCards,
    images,
  };
};
