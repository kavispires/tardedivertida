import { clsx } from 'clsx';
// Types
import type { SuspectCard as SuspectCardType, SuspectStyleVariant } from 'types/tdr';
// Components
import { ImageCard } from 'components/image-cards';
import { DualTranslate } from 'components/language';
// Sass
import './SuspectCard.scss';

type SuspectCardProps = {
  /**
   * Suspect object
   */
  suspect: SuspectCardType;
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

export function SuspectCard({
  suspect,
  width,
  hideName,
  variant,
  preview = false,
  className,
  style,
}: SuspectCardProps) {
  const imageId = getSuspectImageId(suspect.id, variant);
  return (
    <div className={clsx('suspect-card', className)} style={{ width: `${width}px`, ...style }}>
      <ImageCard cardId={imageId} className="suspect-card__image" cardWidth={width} preview={preview} />
      {!hideName && (
        <div className="suspect-card__name">
          <DualTranslate>{suspect.name}</DualTranslate>
        </div>
      )}
    </div>
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
