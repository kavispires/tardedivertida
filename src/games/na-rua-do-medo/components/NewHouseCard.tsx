import clsx from 'clsx';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useCountdown } from 'hooks/useCountdown';
// Utils
import { NOOP } from 'utils/constants';
import { getAnimationClass } from 'utils/helpers';
// Components
import { ImageCard } from 'components/cards';

type NewHouseCardProps = {
  /**
   * The candy, monster, jackpot card
   */
  card: NCard;
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
        timeLeft > 0 ? getAnimationClass('bounceIn') : getAnimationClass('bounceOut')
      )}
    >
      <div className={clsx(`${baseClass}--container`, `${baseClass}--${card.type}`)}>
        <ImageCard imageId={card.key} cardWidth={200} className={clsx(cardBaseClass)} />

        <h3 className={`${baseClass}__name`}>{dualTranslate(card.name)}</h3>
      </div>
    </div>
  );
}
