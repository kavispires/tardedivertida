import clsx from 'clsx';
// Ant Design Resources
import { Image, Tooltip } from 'antd';
// Types
import type { ContenderCard } from 'types/tdr';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';
import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Components
import { ImageBlurButtonContainer } from 'components/image-cards/ImageBlurButtonContainer';
import { DualTranslate } from 'components/language/DualTranslate';
// Sass
import styles from './CharacterCard.module.scss';

export type OverlayColor = 'blue' | 'gray' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'yellow';

type CharacterCardProps = {
  /**
   * The size of the card
   */
  size: number;
  /**
   * The color of the overlay
   */
  overlayColor?: OverlayColor;
  /**
   * The character object
   */
  character: ContenderCard;
  /**
   * The class name to be appended to the container
   */
  className?: string;
  /**
   * Whether the name should be hidden or not
   */
  hideName?: boolean;
};

/**
 * Displays a character/contender card with optional color overlay and blur support
 */
export function CharacterCard({ size, overlayColor, character, className, hideName }: CharacterCardProps) {
  const { dualTranslate } = useLanguage();
  const { shouldBeBlurred } = useBlurCards();
  const baseUrl = useTDBaseUrl('images');

  const isBlurred = shouldBeBlurred(character.id);

  const imageURL = character.id.replace(/-/g, '/');

  const description = character?.description || character.name;

  return (
    <ImageBlurButtonContainer cardId={character.id}>
      <Tooltip
        title={dualTranslate(description)}
        placement="top"
      >
        <div
          className={clsx(styles.characterCard, className)}
          style={{ width: `${size}px` }}
        >
          {!hideName && (
            <span className={styles.characterCardName}>
              <DualTranslate>{character.name}</DualTranslate>
            </span>
          )}
          {overlayColor && (
            <img
              src={`${baseUrl}/game/w-overlay-${overlayColor}.png`}
              className={styles.characterCardOverlay}
              alt="character"
              style={{ width: `${size}px` }}
            />
          )}
          <Image
            src={`${baseUrl}/${imageURL}.jpg`}
            width={size}
            className={clsx(styles.characterCardImage, isBlurred && styles.characterCardImageBlur)}
            fallback={`${baseUrl}/game/w-no-image.jpg`}
            alt={dualTranslate(character.name)}
            preview={false}
            title={dualTranslate(character.name)}
          />
        </div>
      </Tooltip>
    </ImageBlurButtonContainer>
  );
}
