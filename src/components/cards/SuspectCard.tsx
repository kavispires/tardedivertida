import { clsx } from 'clsx';
// Types
import type { SuspectCardData, SuspectStyleVariant } from 'types/tdr';
// Components
import { ComponentPreview } from '@components/general/ComponentPreview';
import { DualTranslate } from '@components/language/DualTranslate';
import { Sprite } from '@components/sprites/Sprite';
// Internal
import { DynamicCard } from './DynamicCard';
// Sass
import styles from './SuspectCard.module.scss';

type SuspectCardProps = {
  /**
   * Suspect object
   */
  suspect: SuspectCardData;
  /**
   * Card width
   */
  width: number;
  /**
   * Hide the suspect name
   */
  hideName?: boolean;
  /**
   * Style variant of the card (it will modify the id)
   */
  variant?: SuspectStyleVariant;
  /**
   * Preview mode for the card (defaults to false)
   */
  preview?: boolean;
  /**
   * Additional class names for the card
   */
  className?: string;
  /**
   * Inline styles for the card
   */
  style?: Omit<React.CSSProperties, 'width'>;
};

/**
 * Displays a suspect card with name and optional variant styling
 */
function SuspectCardBase({ suspect, width, hideName, variant, className, style }: SuspectCardProps) {
  const imageId = getSuspectImageId(suspect.id, variant);
  const { angle, scale, y } = getLabelTransform(suspect.labelTransform || '0|0');

  return (
    <DynamicCard
      aspectRatio={1.5}
      backgroundImageId={imageId}
      width={width}
      style={style}
      className={clsx(styles.suspectCard, className)}
    >
      {!hideName && (
        <DynamicCard.Span
          centerHorizontal
          fontSize="12cqw"
          style={{
            rotate: `${angle}deg`,
            scale: `${scale}`,
          }}
          top={`${y}%`}
        >
          <span className={styles.suspectCardName}>
            <Sprite
              source="demographics"
              spriteId={`gender-${suspect.gender || 'gender-other'}`}
              width="1em"
            />
            <DualTranslate>{suspect.name}</DualTranslate>
          </span>
        </DynamicCard.Span>
      )}
    </DynamicCard>
  );
}

export function SuspectCard(props: SuspectCardProps) {
  if (!props.preview) {
    return <SuspectCardBase {...props} />;
  }

  return (
    <ComponentPreview aspectRatio={2 / 3}>
      <SuspectCardBase {...props} />
    </ComponentPreview>
  );
}

/**
 * Generates a suspect image ID based on the provided ID and optional variant.
 * If no variant is provided, returns the original ID.
 * Otherwise, transforms the ID format to include the variant.
 *
 * @param id - The original suspect ID, expected to have a format like "prefix-suffix"
 * @param variant - Optional variant code to insert into the ID (defaults to 'gb' if specified but empty)
 * @returns The modified suspect image ID with the variant included, or the original ID if no variant provided
 *
 * @example
 * Returns "us-gb-123" if variant is provided
 * getSuspectImageId("us-123", "gb");
 *
 * @example
 * Returns "us-123" if no variant is provided
 * getSuspectImageId("us-123");
 */
export const getSuspectImageId = (() => {
  const cache = new Map<string, string>();

  return (id: string, variant?: SuspectStyleVariant): string => {
    if (!variant) {
      return id;
    }

    const key = `${id}|${variant ?? ''}`;

    if (cache.has(key)) return cache.get(key) as string;

    const splitId = id.split('-');
    const result = `${splitId[0]}-${variant}-${splitId[splitId.length - 1]}`;
    cache.set(key, result);
    return result;
  };
})();

const getLabelTransform = (() => {
  const cache = new Map<string, { angle: number; scale: number; y: number }>();

  return (id: string): { angle: number; scale: number; y: number } => {
    if (cache.has(id)) return cache.get(id) as { angle: number; scale: number; y: number };

    const splitId = id.split('-');
    const y = Number.parseFloat(splitId[0]) || 83;
    const angle = Number.parseFloat(splitId[1]) || 0;
    const scale = Number.parseFloat(splitId[2]) || 1;

    const result = { angle, scale, y };
    cache.set(id, result);
    return result;
  };
})();
