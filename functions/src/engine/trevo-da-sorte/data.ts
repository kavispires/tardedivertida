import { TextCard } from '../../types/tdr';
import utils from '../../utils';

/**
 * Get word cards resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (language: Language): Promise<TextCard[]> => {
  return await utils.tdr.getSingleWords(language);
};
