import clsx from 'clsx';
// Ant Design Resources
import { UpCircleOutlined } from '@ant-design/icons';
import { Button, Image } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { StarIcon } from 'icons/StarIcon';
// Components
import { ImageBlurButton, ImageCard, ImageCardBack } from 'components/image-cards';
import { Translate } from 'components/language';
// Internal
import type { ImageCardObj } from '../utils/types';
import { BORDER_TOTAL_SIZE } from '../utils/constants';

type PlayTableProps = {
  table: ImageCardObj[];
  onPlayCard: GenericFunction;
  userCards: PlainObject;
  isPlayAvailable: boolean;
};

export function PlayTable({ table, onPlayCard, userCards, isPlayAvailable }: PlayTableProps) {
  const cardWidth = useCardWidth(5, { gap: 8, minWidth: 140, maxWidth: 150 });
  const { isLoading } = useLoading();

  return (
    <Image.PreviewGroup>
      <div className="g-table-container">
        <ul className="g-table">
          {table.map((card) => {
            const isSelected = Boolean((userCards ?? {})[card.id]);
            const userCardEntry = userCards[card.id] ?? {};
            if (card.used) {
              return (
                <li
                  key={`g-table-${card.id}`}
                  className="g-table-item"
                  style={{ width: `${cardWidth + 8}px` }}
                >
                  <div className="center">
                    <ImageBlurButton cardId={card.id} />
                  </div>
                  <ImageCardBack
                    cardWidth={cardWidth - BORDER_TOTAL_SIZE}
                    className={clsx(
                      'g-table-image',
                      isSelected && 'g-table-image--selected',
                      getAnimationClass('zoomIn')
                    )}
                    previewImageId={card.id}
                  />
                  {userCardEntry.used && (
                    <div className="g-star-points">
                      {userCardEntry.score === 3 && <StarIcon className="g-star g-star--super-spark" />}
                      {userCardEntry.score > 1 && <StarIcon className="g-star g-star--spark" />}
                      {userCardEntry.score > 0 && <StarIcon className="g-star g-star--spark" />}
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={`g-table-${card.id}`} className="g-table-item" style={{ width: `${cardWidth + 8}px` }}>
                <div className="center">
                  <ImageBlurButton cardId={card.id} />
                </div>
                <ImageCard
                  id={card.id}
                  cardWidth={cardWidth - BORDER_TOTAL_SIZE} // 6 is the border total size
                  className={clsx(
                    'g-table-image',
                    isSelected && 'g-table-image--selected',
                    getAnimationClass('zoomIn')
                  )}
                />
                {isPlayAvailable && userCards[card.id] && (
                  <Button
                    shape="round"
                    size="small"
                    ghost
                    className="g-table-item-button"
                    onClick={() => onPlayCard(card.id)}
                    disabled={isLoading}
                  >
                    <UpCircleOutlined />
                    <Translate pt="Selecionar" en="Select" />
                    <UpCircleOutlined />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Image.PreviewGroup>
  );
}
