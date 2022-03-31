// Types
import { InspirationCard } from '../../utils/tdr';
import { SonhosPesadelosCards } from './types';
// Helpers
import * as resourceUtils from '../resource';

/**
 * Get theme cards resource based on the game's language
 * @param language
 * @returns
 */
export const getInspirationThemes = async (language: string): Promise<SonhosPesadelosCards> => {
  const resourceName = `sonhos-pesadelos-${language}`;
  const cardsResponse = await resourceUtils.fetchResource(resourceName);
  const cards: InspirationCard[] = Object.values(cardsResponse);

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
