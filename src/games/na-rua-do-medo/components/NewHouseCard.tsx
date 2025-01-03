import clsx from 'clsx';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { NOOP } from 'utils/constants';
import { getAnimationClass } from 'utils/helpers';
// Components
import { ImageCard } from 'components/image-cards';
// Internal
import type { StreetCard } from '../utils/types';

type NewHouseCardProps = {
  /**
   * The candy, monster, jackpot card
   */
  card: StreetCard;
};

export function NewHouseCard({ card }: NewHouseCardProps) {
  const { dualTranslate } = useLanguage();

  const baseClass = 'n-new-house-card';
  const cardBaseClass = 'n-new-house-card__card';

  const { timeLeft } = useCountdown({
    duration: 3,
    onExpire: () => NOOP,
  });

  return (
    <div
      className={clsx(
        `${baseClass}`,
        timeLeft > 0 ? getAnimationClass('bounceIn') : getAnimationClass('bounceOut'),
      )}
    >
      <div className={clsx(`${baseClass}--container`, `${baseClass}--${card.type}`)}>
        <ImageCard id={card.key} cardWidth={200} className={clsx(cardBaseClass)} />

        <h3 className={`${baseClass}__name`}>{dualTranslate(card.name)}</h3>
      </div>
    </div>
  );
}
