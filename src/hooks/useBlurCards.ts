// Internal
import { useGlobalLocalStorage } from './useGlobalLocalStorage';

type UseBlurCards = {
  blurredCards: BooleanDictionary;
  shouldBeBlurred: (cardId?: string) => boolean;
  blurCard: (cardId: string) => void;
  isBlurEnabled: boolean;
};

/**
 * Add card ids to the blur dictionary
 * @returns the dictionary of blurred ids, the function to add a blur card, the function to check if a card should be blurred, the flag indicating if the feature was enabled by the user
 */
export function useBlurCards(): UseBlurCards {
  const [blurredCards, setBlurredCards] = useGlobalLocalStorage('blurredCards');
  const [blurEnabled] = useGlobalLocalStorage('blurEnabled');

  const blurCard = (cardId: string) => {
    setBlurredCards({
      ...blurredCards,
      [cardId]: !blurredCards?.[cardId] ?? true,
    });
  };

  const shouldBeBlurred = (cardId?: string) => {
    return Boolean(cardId && blurEnabled && blurredCards?.[cardId]);
  };

  return {
    blurredCards,
    shouldBeBlurred,
    blurCard,
    isBlurEnabled: blurEnabled,
  };
}
