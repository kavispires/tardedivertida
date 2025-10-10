import { ImageCard, ImageCardButton } from '.';
import clsx from 'clsx';
import { motion } from 'motion/react';
import type { ReactNode, Ref } from 'react';
// Ant Design Resources
import { type GetProps, Image, Space } from 'antd';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
// Utils
import { getAnimation } from 'utils/animations';
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
  onSelectCard?: (cardId: ImageCardId) => void;
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
  /**
   * The Image group preview object
   */
  imageGroupPreview?: GetProps<typeof Image.PreviewGroup>['preview'];
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
  minCardSize = 110,
  disabledSelectButton = false,
  selectedCards = {},
  cardClassName = '',
  preview = true,
  imageGroupPreview,
}: ImageCardHandProps) {
  // Prefers cardSize otherwise calculates width based on screen and ratio
  const [cardWidth, containerRef] = useCardWidthByContainerRef(Math.max(sizeRatio, 6), {
    minWidth: minCardSize,
  });

  return (
    <Image.PreviewGroup preview={imageGroupPreview}>
      <Space className={clsx('image-card-hand', className)} ref={containerRef as Ref<HTMLDivElement>}>
        {hand.map((cardId, index) => {
          return (
            <motion.div
              key={`hand-${cardId}`}
              className="image-card-hand__card-container"
              {...getAnimation('slideInUp', { delay: index / 10, ease: 'easeOut', duration: 0.5 })}
            >
              <ImageCardButton
                onClick={onSelectCard}
                cardId={cardId}
                buttonProps={{ className: selectButtonClass }}
                icon={selectButtonIcon}
                buttonText={selectButtonText}
                disabled={disabledSelectButton}
                throttle={!!onSelectCard}
              >
                <ImageCard
                  cardId={cardId}
                  cardWidth={cardSize || cardWidth}
                  className={clsx(selectedCards[cardId] && 'image-card-hand__selected', cardClassName)}
                  preview={preview}
                />
              </ImageCardButton>
            </motion.div>
          );
        })}
      </Space>
    </Image.PreviewGroup>
  );
}
