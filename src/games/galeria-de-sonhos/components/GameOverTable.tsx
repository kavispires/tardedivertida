import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { ImageBlurButton, ImageCard } from 'components/image-cards';
// Internal
import type { ImageCardObj } from '../utils/types';

type TableProps = {
  table: ImageCardObj[];
};

export function GameOverTable({ table }: TableProps) {
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 60, maxWidth: 100 });
  return (
    <Image.PreviewGroup>
      <ul className="g-table g-table--game-over">
        {table.map((card) => {
          return (
            <li key={`g-table-${card.id}`} className="g-table-item" style={{ width: `${cardWidth + 8}px` }}>
              <ImageBlurButton cardId={card.id} />
              <ImageCard
                id={card.id}
                cardWidth={cardWidth - 6} // 6 is the border total size
                className={clsx('g-table-image', getAnimationClass('zoomIn'))}
              />
            </li>
          );
        })}
      </ul>
    </Image.PreviewGroup>
  );
}
