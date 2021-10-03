import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Button } from 'antd';
import { DownSquareOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth, useLanguage } from '../../hooks';
// Components
import { ImageBlurButton, ImageCard } from '.';
import { translate } from '../shared';

export function ImageCardHand({
  hand = [],
  onSelectCard,
  selectButtonLabel,
  className,
  selectButtonClass,
  sizeRatio,
  cardSize,
  minCardSize,
  disabledSelectButton,
}) {
  const language = useLanguage();
  // Prefers cardSize otherwise calculates width based on screen and ratio
  const cardWidth = useCardWidth(sizeRatio, 32, minCardSize);

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
                {translate('Selecionar', 'Select', language, selectButtonLabel)}
              </Button>
            )}
            <ImageCard imageId={cardId} cardWidth={cardSize || cardWidth} />
            <ImageBlurButton cardId={cardId} />
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
  disabledSelectButtons: PropTypes.arrayOf(PropTypes.bool),
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
  minCardSize: 120,
};
