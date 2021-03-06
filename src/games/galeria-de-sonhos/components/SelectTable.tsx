import clsx from 'clsx';
// Design Resources
import { Button, Image } from 'antd';
import { UpCircleOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth } from 'hooks';
// Components
import { ImageBlurButton, ImageCard } from 'components/cards';
import { Translate } from 'components/language';

type SelectTableProps = {
  table: GImageCard[];
  onSelectCard: GenericFunction;
  selectedCards: BooleanDictionary;
};

export function SelectTable({ table, onSelectCard, selectedCards }: SelectTableProps) {
  const cardWidth = useCardWidth(5, 8, 140, 150);
  return (
    <Image.PreviewGroup>
      <ul className="g-table">
        {table.map((card) => {
          const isSelected = selectedCards[card.id];

          return (
            <li key={`g-table-${card.id}`} className="g-table-item" style={{ width: `${cardWidth + 8}px` }}>
              <div className="center">
                <ImageBlurButton cardId={card.id} />
              </div>
              <ImageCard
                imageId={card.id}
                cardWidth={cardWidth - 6} // 6 is the border total size
                className={clsx('g-table-image', isSelected && 'g-table-image--selected')}
              />

              <Button
                shape="round"
                size="small"
                ghost={!isSelected}
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
            </li>
          );
        })}
      </ul>
    </Image.PreviewGroup>
  );
}
