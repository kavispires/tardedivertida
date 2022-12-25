import clsx from 'clsx';
// Ant Design Resources
import { Tooltip } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { CandyCount } from './CandyCount';

type HouseCardProps = {
  /**
   * The candy, monster, jackpot card
   */
  card: NCard;
  /**
   * The quantity of candy left in the sidewalk
   */
  candyLeftover: number;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Unique id
   */
  id?: string;
  /**
   * If the house is the last one
   */
  active?: boolean;
  /**
   * Enables or disables preview
   */
  preview?: boolean;
};

export function HouseCard({
  card,
  candyLeftover,
  id,
  className = '',
  active = false,
  preview,
}: HouseCardProps) {
  const { dualTranslate } = useLanguage();

  const baseClass = 'n-house-card';
  const cardBaseClass = 'n-house-card__card';

  return (
    <div
      className={clsx(baseClass, `${baseClass}--${card.type}`, active && `${baseClass}--active`, className)}
      id={id}
    >
      <div className="n-house-card__sidewalk">
        {card.type === 'candy' && candyLeftover > 0 && (
          <Tooltip
            color="hotPink"
            title={
              <Translate
                pt="Doces que não foram divididos entre os jogadores"
                en="Candy that wasn't shared between players"
              />
            }
          >
            <CandyCount candyCount={candyLeftover} />
          </Tooltip>
        )}
      </div>
      <ImageCard imageId={card.key} cardWidth={80} className={clsx(cardBaseClass)} preview={preview} />

      <h3 className={`${baseClass}__name`}>{dualTranslate(card.name)}</h3>

      {active && (
        <span
          className={clsx(`${baseClass}__active`, getAnimationClass('heartBeat', undefined, 'slow', true))}
        />
      )}
    </div>
  );
}
