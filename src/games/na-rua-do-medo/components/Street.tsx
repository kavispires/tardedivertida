import clsx from 'clsx';
import { useEffect } from 'react';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Internal
import type { CandySidewalk, StreetCard } from '../utils/types';
import { HouseCard } from './HouseCard';

type StreetProps = {
  street: StreetCard[];
  currentCard?: StreetCard;
  candySidewalk: CandySidewalk;
};

export function Street({ street, currentCard, candySidewalk }: StreetProps) {
  const BASE_URL = useTDBaseUrl('assets');
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const streetEl = document.getElementById('street');
    const currentCardEl = document.getElementById('current-card');

    if (streetEl !== null && currentCardEl !== null) {
      streetEl.scrollLeft = currentCardEl.offsetLeft;
    }
  }, [street, currentCard]);

  return (
    <div
      className="n-street"
      id="street"
      style={{
        backgroundImage: `url('${BASE_URL}/game/n-street.png')`,
      }}
    >
      {street.map((card, index) => {
        return (
          <HouseCard
            key={card.id}
            card={card}
            candyLeftover={candySidewalk[index].leftover}
            id={index === street.length - 1 ? 'current-card' : undefined}
          />
        );
      })}
      {currentCard && (
        <HouseCard
          card={currentCard}
          candyLeftover={candySidewalk[candySidewalk.length - 1].leftover}
          className={clsx('n-current-card', getAnimationClass('flipInY'))}
          id="current-card"
          active
        />
      )}
    </div>
  );
}
