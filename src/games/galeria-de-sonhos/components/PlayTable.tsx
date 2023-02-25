import clsx from 'clsx';
// Ant Design Resources
import { Button, Image } from 'antd';
import { UpCircleOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { StarIcon } from 'icons/StarIcon';
// Components
import { ImageBlurButton, ImageCard, ImageCardBack } from 'components/cards';
import { Translate } from 'components/language';

type PlayTableProps = {
  table: GImageCard[];
  onPlayCard: GenericFunction;
  userCards: PlainObject;
  isPlayAvailable: boolean;
};

export function PlayTable({ table, onPlayCard, userCards, isPlayAvailable }: PlayTableProps) {
  const cardWidth = useCardWidth(5, 8, 140, 150);
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
                    cardWidth={cardWidth - 6}
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
                  imageId={card.id}
                  cardWidth={cardWidth - 6} // 6 is the border total size
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
