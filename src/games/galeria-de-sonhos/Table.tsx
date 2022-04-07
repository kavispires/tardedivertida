import clsx from 'clsx';
// Ant Design Resources
import { Button } from 'antd';
import { UpCircleOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth } from 'hooks';
import { ImageBlurButton, ImageCard, ImageCardBack } from 'components/cards';
import { Translate } from 'components/language';
// Components

type TableProps = {
  table: GImageCard[];
  onSelectCard: GenericFunction;
  selectedCards: BooleanDictionary;
  userCards?: PlainObject;
};

export function Table({ table, onSelectCard, selectedCards, userCards }: TableProps) {
  const cardWidth = useCardWidth(5, 8, 140, 150);
  return (
    <ul className="g-table">
      {table.map((card) => {
        const isSelected = selectedCards[card.id] || Boolean((userCards ?? {})[card.id]);

        if (card.used) {
          return (
            <li key={`g-table-${card.id}`} className="g-table-item" style={{ width: `${cardWidth + 8}px` }}>
              <ImageBlurButton cardId={card.id} />
              <ImageCardBack
                cardWidth={cardWidth - 6}
                className={clsx('g-table-image', isSelected && 'g-table-image--selected')}
              />
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
            {(!userCards || userCards[card.id]) && (
              <Button
                shape="round"
                size="small"
                ghost
                className="g-table-item-button"
                onClick={() => onSelectCard(card.id)}
              >
                <UpCircleOutlined />
                {isSelected ? (
                  <Translate pt="Desmarcar" en="Deselect" />
                ) : (
                  <Translate pt="Selecionar" en="Select" />
                )}
                <UpCircleOutlined />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
