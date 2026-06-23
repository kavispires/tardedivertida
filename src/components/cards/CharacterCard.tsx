import clsx from 'clsx';
// Ant Design Resources
import { Image, Tooltip } from 'antd';
// Types
import type { ContenderCardData } from 'types/tdr';
// Hooks
import { useBlurCards } from '@hooks/useBlurCards';
import { useLanguage } from '@hooks/useLanguage';
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
// Components
import { ImageBlurButtonContainer } from '@components/image-cards/ImageBlurButtonContainer';
import { DualTranslate } from '@components/language/DualTranslate';
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
  character: ContenderCardData;
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
  const { translate } = useLanguage();
  const { shouldBeBlurred } = useBlurCards();
  const imagesBaseUrl = useTDBaseUrl('images');
  const assetsBaseUrl = useTDBaseUrl('assets');

  const isBlurred = shouldBeBlurred(character.id);

  const imageURL = character.id.replace(/-/g, '/');

  const description = {
    pt: character.description?.pt || character.name.pt,
    en: character.description?.en || character.name.en,
  };

  return (
    <ImageBlurButtonContainer cardId={character.id}>
      <Tooltip
        title={translate(description)}
        placement="top"
      >
        <div
          className={clsx(styles.characterCard, className)}
          style={{ width: `${size}px` }}
        >
          {!hideName && (
            <span
              className={styles.characterCardName}
              style={{ fontSize: `clamp(1em, ${size * 0.15}px, 1.5em)` }}
            >
              <DualTranslate>{character.name}</DualTranslate>
            </span>
          )}
          {overlayColor && (
            <img
              src={`${assetsBaseUrl}/game/w-overlay-${overlayColor}.png`}
              className={styles.characterCardOverlay}
              alt="character"
              style={{ width: `${size}px` }}
            />
          )}
          <Image
            src={`${imagesBaseUrl}/${imageURL}.jpg`}
            width={size}
            className={clsx(styles.characterCardImage, isBlurred && styles.characterCardImageBlur)}
            fallback={`${assetsBaseUrl}/game/w-no-image.jpg`}
            alt={translate(character.name)}
            preview={false}
            title={translate(character.name)}
          />
        </div>
      </Tooltip>
    </ImageBlurButtonContainer>
  );
}
