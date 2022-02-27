import { UpCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import clsx from 'clsx';
import { Icons, ImageBlurButton, ImageCard, ImageCardBack, Translate } from '../../components';
import { useCardWidth, useLoading } from '../../hooks';

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
    <ul className="g-table">
      {table.map((card) => {
        const isSelected = Boolean((userCards ?? {})[card.id]);
        const userCardEntry = userCards[card.id];
        if (card.used) {
          return (
            <li key={`g-table-${card.id}`} className="g-table-item" style={{ width: `${cardWidth + 8}px` }}>
              <ImageBlurButton cardId={card.id} />
              <ImageCardBack
                cardWidth={cardWidth - 6}
                className={clsx('g-table-image', isSelected && 'g-table-image--selected')}
              />
              {userCardEntry.used && (
                <div className="g-star-points">
                  {userCardEntry.score === 3 ? (
                    <Icons.Star className="g-star g-star--super-spark" />
                  ) : (
                    <Icons.StarOutline className="g-star g-star--super-spark" />
                  )}
                  {userCardEntry.score > 1 ? (
                    <Icons.Star className="g-star g-star--spark" />
                  ) : (
                    <Icons.StarOutline className="g-star g-star--spark" />
                  )}
                  {userCardEntry.score > 0 ? (
                    <Icons.Star className="g-star g-star--spark" />
                  ) : (
                    <Icons.StarOutline className="g-star g-star--spark" />
                  )}
                </div>
              )}
            </li>
          );
        }

        return (
          <li key={`g-table-${card.id}`} className="g-table-item" style={{ width: `${cardWidth + 8}px` }}>
            <ImageBlurButton cardId={card.id} />
            <ImageCard
              imageId={card.id}
              cardWidth={cardWidth - 6} // 6 is the border total size
              className={clsx('g-table-image', isSelected && 'g-table-image--selected')}
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
  );
}
