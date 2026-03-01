import clsx from 'clsx';
import { capitalize } from 'lodash';
// Ant Design Resources
import { Popover } from 'antd';
// Types
import type { CrimesHediondosCard } from 'types/tdr';
// Hooks
import { useDevFeatures } from 'hooks/useDevFeatures';
import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Components
import { ImageBlurButtonContainer } from 'components/image-cards';
import { DualTranslate } from 'components/language';
// Internal
import { ItemSprite } from './ItemCard';
// Sass
import styles from './CrimeItemCard.module.scss';

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
  isSelected = false,
  className = '',
}: CrimeItemCardProps) {
  const { dualTranslate } = useLanguage();
  const { isDebugEnabled } = useDevFeatures();
  const baseUrl = useTDBaseUrl('images');
  const backgroundImage = `back/crime${capitalize(item.type)}`;

  return (
    <ImageBlurButtonContainer cardId={item.id}>
      <div
        className={clsx(
          styles.crimeItemCard,
          item.type === 'weapon' && styles.crimeItemCardWeapon,
          item.type === 'evidence' && styles.crimeItemCardEvidence,
          isSelected && styles.crimeItemCardSelected,
          className,
        )}
        style={{
          width: cardWidth,
          backgroundImage: `url(${baseUrl}/${backgroundImage}.jpg)`,
          ...(activeColor && isSelected ? { borderColor: activeColor, backgroundColor: activeColor } : {}),
        }}
      >
        <Popover content={dualTranslate(item.name).toUpperCase()}>
          <div
            className={styles.crimeItemCardName}
            style={{ maxWidth: `${cardWidth}px` }}
          >
            <span>{isDebugEnabled ? item.id : <DualTranslate>{item.name}</DualTranslate>}</span>
          </div>
        </Popover>
        <div
          className={clsx(
            styles.crimeItemCardItemContainer,
            item.type === 'weapon'
              ? styles.crimeItemCardItemContainerWeapon
              : styles.crimeItemCardItemContainerEvidence,
          )}
        >
          <ItemSprite
            itemId={item.itemId ?? '0'}
            width={cardWidth * 0.75}
            className={styles.crimeItemCardItem}
          />
        </div>
      </div>
    </ImageBlurButtonContainer>
  );
}

export function CrimeItemBackgroundCard({
  id,
  cardWidth,
  className = '',
}: Pick<CrimeItemCardProps, 'cardWidth' | 'className'> & { id: 'blank' | 'x' | 'weapon' | 'evidence' }) {
  const baseUrl = useTDBaseUrl('images');
  const backgroundImage = `back/crime${capitalize(id)}`;

  return (
    <div
      className={clsx(
        styles.crimeItemCard,
        id === 'weapon' && styles.crimeItemCardWeapon,
        id === 'evidence' && styles.crimeItemCardEvidence,
        className,
      )}
      style={{
        width: cardWidth,
        backgroundImage: `url(${baseUrl}/${backgroundImage}.jpg)`,
      }}
    >
      .
    </div>
  );
}
