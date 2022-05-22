import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
// Hooks
import { useCardWidth } from 'hooks';
// Helpers
import { getAnimationClass } from 'utils/helpers';
// Components
import { ImageBlurButton, ImageCard } from 'components/cards';

type TableProps = {
  table: GImageCard[];
};

export function GameOverTable({ table }: TableProps) {
  const cardWidth = useCardWidth(12, 8, 60, 100);
  return (
    <Image.PreviewGroup>
      <ul className="g-table g-table--game-over">
        {table.map((card) => {
          return (
            <li key={`g-table-${card.id}`} className="g-table-item" style={{ width: `${cardWidth + 8}px` }}>
              <ImageBlurButton cardId={card.id} />
              <ImageCard
                imageId={card.id}
                cardWidth={cardWidth - 6} // 6 is the border total size
                className={clsx(
                  'g-table-image',

                  getAnimationClass('zoomIn')
                )}
              />
            </li>
          );
        })}
      </ul>
    </Image.PreviewGroup>
  );
}
