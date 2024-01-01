import clsx from 'clsx';
// Ant Design Resources
import { Popover, Tag } from 'antd';
// Hooks
import { useDevFeatures } from 'hooks/useDevFeatures';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { DualTranslate } from 'components/language';
// Sass
import './CrimeItemCard.scss';

type CrimeItemCardProps = {
  /**
   * Crime item
   */
  item: CrimesHediondosCard;
  /**
   * Card width
   */
  cardWidth: number;
  /**
   * Whether to enable the preview or not
   */
  preview?: boolean;
  /**
   * Whether the card is selected or not
   */
  isSelected?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Optional active color
   */
  activeColor?: string;
};

export function CrimeItemCard({
  item,
  cardWidth,
  activeColor,
  preview = true,
  isSelected = false,
  className = '',
}: CrimeItemCardProps) {
  const { dualTranslate } = useLanguage();
  const { isDebugEnabled } = useDevFeatures();
  return (
    <ImageBlurButtonContainer cardId={item.id}>
      <div
        className={clsx('crime-item-card', isSelected && 'crime-item-card--selected', className)}
        style={activeColor && isSelected ? { borderColor: 'black', backgroundColor: activeColor } : {}}
      >
        <Popover content={dualTranslate(item.name).toUpperCase()}>
          <Tag
            className="crime-item-card__name"
            color={item.type === 'weapon' ? 'geekblue' : 'volcano'}
            style={{ maxWidth: `${cardWidth + 16}px` }}
          >
            <span>{isDebugEnabled ? item.id : <DualTranslate>{item.name}</DualTranslate>}</span>
          </Tag>
        </Popover>
        <ImageCard id={item.id} cardWidth={cardWidth} className="crime-item-card__image" preview={preview} />
      </div>
    </ImageBlurButtonContainer>
  );
}
