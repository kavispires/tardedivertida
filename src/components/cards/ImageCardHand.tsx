import clsx from 'clsx';
// Ant Design Resources
import { Button, Image } from 'antd';
import { DownSquareOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth, useLanguage } from 'hooks';
// Components
import { ImageBlurButton, ImageCard } from '.';

type ImageCardHandProps = {
  hand: string[];
  onSelectCard?: GenericFunction;
  selectButtonLabel?: string;
  /**
   * Optional custom class name
   */
  className?: string;
  selectButtonClass?: string;
  sizeRatio?: number;
  cardSize?: number;
  minCardSize?: number;
  disabledSelectButton?: boolean;
};

export function ImageCardHand({
  hand = [],
  onSelectCard,
  selectButtonLabel,
  className = '',
  selectButtonClass = '',
  sizeRatio = 8,
  cardSize,
  minCardSize = 80,
  disabledSelectButton = false,
}: ImageCardHandProps) {
  const { translate } = useLanguage();
  // Prefers cardSize otherwise calculates width based on screen and ratio
  const cardWidth = useCardWidth(sizeRatio, 32, minCardSize);

  return (
    <Image.PreviewGroup>
      <div className={clsx('image-card-hand', className)}>
        {hand.map((cardId) => {
          return (
            <div key={`hand-${cardId}`} className="image-card-hand__card-container">
              {Boolean(onSelectCard) && (
                <Button
                  icon={<DownSquareOutlined />}
                  className={selectButtonClass}
                  onClick={() => onSelectCard!(cardId)}
                  size="small"
                  disabled={disabledSelectButton}
                >
                  {translate('Selecionar', 'Select', selectButtonLabel)}
                </Button>
              )}
              <ImageCard imageId={cardId} cardWidth={cardSize || cardWidth} />
              <ImageBlurButton cardId={cardId} />
            </div>
          );
        })}
      </div>
    </Image.PreviewGroup>
  );
}
