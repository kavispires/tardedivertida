import clsx from 'clsx';
// Design Resources
import { Image } from 'antd';
// Types
import type { ImageCardObj } from '../utils/types';
import { CloseCircleOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { BORDER_TOTAL_SIZE } from '../utils/constants';
import { getAnimationClass } from 'utils/helpers';
// Components
import { ImageCard, ImageCardButton } from 'components/image-cards';
import { Translate } from 'components/language';

type SelectTableProps = {
  table: ImageCardObj[];
  onSelectCard: GenericFunction;
  selectedCards: BooleanDictionary;
};

export function SelectTable({ table, onSelectCard, selectedCards }: SelectTableProps) {
  const cardWidth = useCardWidth(5, { gap: 8, minWidth: 140, maxWidth: 150 });
  return (
    <div className="g-table-container">
      <Image.PreviewGroup>
        <ul className="g-table">
          {table.map((card, index) => {
            const isSelected = selectedCards[card.id];

            return (
              <li
                key={`g-table-${card.id}`}
                className={clsx(
                  'g-table-item',
                  getAnimationClass('flipInY', {
                    delay: index,
                  })
                )}
                style={{ width: `${cardWidth + 8}px` }}
              >
                <ImageCardButton
                  imageId={card.id}
                  onClick={() => onSelectCard(card.id)}
                  over
                  buttonPosition="bottom"
                  icon={isSelected ? <CloseCircleOutlined /> : undefined}
                  buttonText={
                    isSelected ? (
                      <Translate pt="Desmarcar" en="Deselect" />
                    ) : (
                      <Translate pt="Selecionar" en="Select" />
                    )
                  }
                >
                  <ImageCard
                    imageId={card.id}
                    cardWidth={cardWidth - BORDER_TOTAL_SIZE} // 6 is the border total size
                    className={clsx('g-table-image', isSelected && 'g-table-image--selected')}
                  />
                </ImageCardButton>
              </li>
            );
          })}
        </ul>
      </Image.PreviewGroup>
    </div>
  );
}
