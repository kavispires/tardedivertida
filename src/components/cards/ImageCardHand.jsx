import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Button } from 'antd';
import { DownSquareOutlined } from '@ant-design/icons';
// Hooks
import { useDimensions } from '../../hooks';
// Components
import { ImageCard } from '.';

export function ImageCardHand({
  hand = [],
  onSelectCard,
  selectButtonLabel,
  className,
  selectButtonClass,
  sizeRatio,
  cardSize,
  disabledSelectButton,
}) {
  const [screenWidth] = useDimensions();
  // Prefers cardSize otherwise calculates width based on screen and ratio
  const cardWidth = useMemo(() => cardSize || screenWidth / sizeRatio || 200, [
    cardSize,
    screenWidth,
    sizeRatio,
  ]);

  return (
    <div className={clsx('image-card-hand', className)}>
      {hand.map((cardId) => {
        return (
          <div key={`hand-${cardId}`} className="image-card-hand__card-container">
            {Boolean(onSelectCard) && (
              <Button
                icon={<DownSquareOutlined />}
                className={selectButtonClass}
                onClick={() => onSelectCard(cardId)}
                size="small"
                ghost
                disabled={disabledSelectButton}
              >
                {selectButtonLabel}
              </Button>
            )}
            <ImageCard imageId={cardId} cardWidth={cardWidth} />
          </div>
        );
      })}
    </div>
  );
}

ImageCardHand.propTypes = {
  cardSize: PropTypes.number,
  className: PropTypes.string,
  disabledSelectButton: PropTypes.bool,
  hand: PropTypes.arrayOf(PropTypes.string),
  onSelectCard: PropTypes.func,
  selectButtonClass: PropTypes.string,
  selectButtonLabel: PropTypes.string,
  sizeRatio: PropTypes.number,
};

ImageCardHand.defaultProps = {
  className: '',
  disabledSelectButton: false,
  hand: [],
  onSelectCard: null,
  selectButtonClass: '',
  sizeRatio: 8,
};
