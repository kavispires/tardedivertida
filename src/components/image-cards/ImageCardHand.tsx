import { ReactNode } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { ImageCard, ImageCardButton } from '.';
// Sass
import './ImageCardHand.scss';

type ImageCardHandProps = {
  /**
   * The list of card ids
   */
  hand: ImageCardId[];
  /**
   * Function to trigger when clicking on the select button
   */
  onSelectCard?: GenericFunction;
  /**
   * Select button custom label
   */
  selectButtonText?: ReactNode;
  /**
   * Select button custom icon
   */
  selectButtonIcon?: ReactNode;
  /**
   * Select button custom class
   */
  selectButtonClass?: string;
  /**
   * Disable select button
   */
  disabledSelectButton?: boolean;
  /**
   * Optional custom class name for the hand container
   */
  className?: string;
  /**
   * The size of the card
   */
  cardSize?: number;
  /**
   * If no card size is provided, the ratio is used instead to determine card size (default 8)
   */
  sizeRatio?: number;
  /**
   * Minimum width of a card (default 80)
   */
  minCardSize?: number;
  /**
   * Cache showing which cards have been selected and should be highlighted
   */
  selectedCards?: BooleanDictionary;
  /**
   * Custom card class
   */
  cardClassName?: string;
  /**
   * Enable preview (default: true)
   */
  preview?: boolean;
};

export function ImageCardHand({
  hand = [],
  onSelectCard,
  selectButtonText,
  selectButtonIcon,
  className = '',
  selectButtonClass = '',
  sizeRatio = 8,
  cardSize,
  minCardSize = 80,
  disabledSelectButton = false,
  selectedCards = {},
  cardClassName = '',
  preview = true,
}: ImageCardHandProps) {
  // Prefers cardSize otherwise calculates width based on screen and ratio
  const cardWidth = useCardWidth(sizeRatio, { minWidth: minCardSize });

  return (
    <Image.PreviewGroup>
      <div className={clsx('image-card-hand', className)}>
        {hand.map((cardId) => {
          return (
            <div
              key={`hand-${cardId}`}
              className={clsx('image-card-hand__card-container', getAnimationClass('slideInRight'))}
            >
              <ImageCardButton
                onClick={onSelectCard}
                imageId={cardId}
                buttonProps={{ className: selectButtonClass }}
                icon={selectButtonIcon}
                buttonText={selectButtonText}
                disabled={disabledSelectButton}
              >
                <ImageCard
                  imageId={cardId}
                  cardWidth={cardSize || cardWidth}
                  className={clsx(selectedCards[cardId] && 'image-card-hand__selected', cardClassName)}
                  preview={preview}
                />
              </ImageCardButton>
            </div>
          );
        })}
      </div>
    </Image.PreviewGroup>
  );
}
