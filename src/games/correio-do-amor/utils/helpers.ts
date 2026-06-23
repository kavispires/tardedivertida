// Utils
import { SEPARATOR } from 'utils/constants';

/**
 * Get the card key which is used as a key for cardsDict
 * @returns The key of the card
 */
export const getCardKeyFromId = (cardId: string) => {
  const [key] = cardId.split(SEPARATOR);
  return key;
};
