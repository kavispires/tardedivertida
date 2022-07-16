import clsx from 'clsx';
// Ant Design Resources
import { Popover, Tag } from 'antd';
// Hooks
import { useDevFeatures, useLanguage } from 'hooks';
// Components
import { ImageCard } from 'components/cards';

type ItemCardProps = {
  item: HCard;
  cardWidth: number;
  preview?: boolean;
  isSelected?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  activeColor?: string;
};

export function ItemCard({
  item,
  cardWidth,
  activeColor,
  preview = true,
  isSelected = false,
  className = '',
}: ItemCardProps) {
  const { language } = useLanguage();
  const { isDebugEnabled } = useDevFeatures();
  return (
    <div
      className={clsx('h-item-card', isSelected && 'h-item-card--selected', className)}
      style={activeColor && isSelected ? { borderColor: 'black', backgroundColor: activeColor } : {}}
    >
      <Popover content={item.name[language].toUpperCase()}>
        <Tag
          className="h-item-card__name"
          color={item.type === 'weapon' ? 'geekblue' : 'volcano'}
          style={{ maxWidth: `${cardWidth + 16}px` }}
        >
          <span>{isDebugEnabled ? item.id : item.name[language]}</span>
        </Tag>
      </Popover>
      <ImageCard imageId={item.id} cardWidth={cardWidth} className="h-item-card__image" preview={preview} />
    </div>
  );
}
