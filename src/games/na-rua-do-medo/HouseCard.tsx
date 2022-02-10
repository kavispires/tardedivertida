import clsx from 'clsx';
// Design Resources
import { Tooltip } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { ImageCard, Translate } from '../../components';
import { CandyCount } from './CandyCount';

type HouseCardProps = {
  card: NCard;
  candyLeftover: number;
  className?: string;
  id?: string;
};

export function HouseCard({ card, candyLeftover, className = '', id }: HouseCardProps) {
  const { language } = useLanguage();

  const baseClass = 'n-house-card';
  const cardBaseClass = 'n-house-card__card';

  return (
    <div className={clsx(baseClass, `${baseClass}--${card.type}`, className)} id={id}>
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
      <ImageCard imageId={card.key} cardWidth={80} className={clsx(cardBaseClass)} />

      <h3 className={`${baseClass}__name`}>{card.name[language]}</h3>
    </div>
  );
}
