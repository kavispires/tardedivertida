import clsx from 'clsx';
import { useEffect } from 'react';
// Helpers
import { getAnimationClass } from 'utils/helpers';
// Components
import { HouseCard } from './HouseCard';

type StreetProps = {
  street: NStreet;
  currentCard?: NCard;
  candySidewalk: CandySidewalk;
};

export function Street({ street, currentCard, candySidewalk }: StreetProps) {
  useEffect(() => {
    const streetEl = document.getElementById('street');
    const currentCardEl = document.getElementById('current-card');
    if (streetEl != null && currentCardEl != null) {
      streetEl.scrollLeft = currentCardEl.offsetLeft;
    }
  }, [street, currentCard]);

  return (
    <div className="n-street" id="street">
      {street.map((card, index) => {
        return <HouseCard key={card.id} card={card} candyLeftover={candySidewalk[index].leftover} />;
      })}
      {currentCard && (
        <HouseCard
          card={currentCard}
          candyLeftover={candySidewalk[candySidewalk.length - 1].leftover}
          className={clsx('n-current-card', getAnimationClass('flipInY'))}
          id="current-card"
        />
      )}
    </div>
  );
}
