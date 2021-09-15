import { useEffect } from 'react';
import { useGlobalState, useLocalStorage } from './index';

/**
 * Add card ids to the blur dictionary
 * @returns [object, function, boolean] the dictionary of blurred ids, the function to add a blur card, flag indicating if the userid contains `fla`
 */
export function useBlurCards() {
  const [blurredCards, setBlurredCards] = useGlobalState('blurredCards');
  const [userId] = useGlobalState('userId');
  const [getLocalStorage, setLocalStorage] = useLocalStorage();

  const isFlavia = userId?.includes('fla');

  const blurCard = (cardId) => {
    setBlurredCards((s) => ({
      ...s,
      [cardId]: !s?.[cardId] ?? true,
    }));
  };

  useEffect(() => {
    setBlurredCards(getLocalStorage('blurredCards'));
  }, []); // eslint-disable-line

  useEffect(() => {
    if (Object.keys(blurredCards).length) {
      setLocalStorage({ blurredCards: blurredCards });
    }
  }, [blurredCards, setLocalStorage]);

  return [blurredCards, blurCard, isFlavia];
}
