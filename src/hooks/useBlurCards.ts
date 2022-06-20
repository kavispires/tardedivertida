import { useEffect } from 'react';
import { useEffectOnce } from 'react-use';
import { useGlobalState, useLocalStorage } from './index';

type UseBlueCards = {
  blurredCards: BooleanDictionary;
  shouldBeBlurred: (cardId?: string) => boolean;
  blurCard: (cardId: string) => void;
  isBlurEnabled: boolean;
};

/**
 * Add card ids to the blur dictionary
 * @returns the dictionary of blurred ids, the function to add a blur card, the function to check if a card should be blurred, the flag indicating if the feature was enabled by the user
 */
export function useBlurCards(): UseBlueCards {
  const [blurredCards, setBlurredCards] = useGlobalState('blurredCards');
  const [blurEnabled] = useGlobalState('blurEnabled');
  const [getLocalStorage, setLocalStorage] = useLocalStorage();

  const blurCard = (cardId: string) => {
    setBlurredCards((s: BooleanDictionary) => ({
      ...s,
      [cardId]: !s?.[cardId] ?? true,
    }));
  };

  const shouldBeBlurred = (cardId?: string) => {
    return Boolean(cardId && blurEnabled && blurredCards?.[cardId]);
  };

  useEffectOnce(() => {
    setBlurredCards(getLocalStorage('blurredCards') ?? {});
  });

  useEffect(() => {
    if (Object.keys(blurredCards ?? {}).length) {
      setLocalStorage({ blurredCards: blurredCards ?? {} });
    }
  }, [blurredCards, setLocalStorage]);

  return {
    blurredCards,
    shouldBeBlurred,
    blurCard,
    isBlurEnabled: blurEnabled,
  };
}
