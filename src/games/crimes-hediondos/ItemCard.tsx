import { Popover, Tag } from 'antd';
import clsx from 'clsx';
import { ImageCard } from 'components';
import { useLanguage } from 'hooks';

type ItemCardProps = {
  item: HCard;
  cardWidth: number;
  preview?: boolean;
  isSelected?: boolean;
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
          <span>{item.name[language]}</span>
        </Tag>
      </Popover>
      <ImageCard imageId={item.id} cardWidth={cardWidth} className="h-item-card__image" preview={preview} />
    </div>
  );
}
