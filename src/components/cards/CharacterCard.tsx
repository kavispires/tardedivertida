import clsx from 'clsx';
// Ant Design Resources
import { Image, Tooltip } from 'antd';
// Types
import type { ContenderCard } from 'types/tdr';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';
import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { ImageBlurButtonContainer } from 'components/image-cards';
import { DualTranslate } from 'components/language';
// Sass
import './CharacterCard.scss';

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
          className={clsx('character-card', className)}
          style={{ width: `${size}px` }}
        >
          {!hideName && (
            <span className="character-card__name">
              <DualTranslate>{character.name}</DualTranslate>
            </span>
          )}
          {overlayColor && (
            <img
              src={`${PUBLIC_URL.IN_GAME}/w-overlay-${overlayColor}.png`}
              className="character-card__overlay"
              alt="character"
              style={{ width: `${size}px` }}
            />
          )}
          <Image
            src={`${baseUrl}/${imageURL}.jpg`}
            width={size}
            className={clsx('character-card__image', isBlurred && 'character-card__image--blur')}
            fallback={`${PUBLIC_URL.IN_GAME}/w-no-image.jpg`}
            alt={dualTranslate(character.name)}
            preview={false}
            title={dualTranslate(character.name)}
          />
        </div>
      </Tooltip>
    </ImageBlurButtonContainer>
  );
}
