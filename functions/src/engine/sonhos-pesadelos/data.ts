// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { NamingPromptCard } from '../../utils/tdr';
import type { SonhosPesadelosCards } from './types';
// Helpers
import * as resourceUtils from '../resource';

/**
 * Get theme cards resource based on the game's language
 * @param language
 * @returns
 */
export const getInspirationThemes = async (language: string): Promise<SonhosPesadelosCards> => {
  const resourceName = `${TDR_RESOURCES.NAMING_PROMPTS}-${language}`;
  const cardsResponse = await resourceUtils.fetchResource(resourceName);
  const cards: NamingPromptCard[] = Object.values(cardsResponse);

  return Object.values(cards).reduce(
    (acc: SonhosPesadelosCards, entry) => {
      acc[entry.level].push(entry);
      return acc;
    },
    {
      2: [],
      3: [],
      4: [],
    }
  );
};
