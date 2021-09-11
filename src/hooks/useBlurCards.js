import { useGlobalState } from './index';

/**
 * Add card ids to the blur dictionary
 * @returns [object, function, boolean] the dictionary of blurred ids, the function to add a blur card, flag indicating if the userid contains `fla`
 */
export function useBlurCards() {
  const [blurredCards, setBlurredCards] = useGlobalState('blurredCards');
  const [userId] = useGlobalState('userId');
  const isFlavia = userId?.includes('fla');

  const blurCard = (cardId) => {
    setBlurredCards((s) => ({
      ...s,
      [cardId]: !s?.[cardId] ?? true,
    }));
  };

  return [blurredCards, blurCard, isFlavia];
}
