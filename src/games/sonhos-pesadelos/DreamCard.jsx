import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import clsx from 'clsx';
// Design Resources
import { Button } from 'antd';
// Hooks
import { useBlurCards, useLanguage } from '../../hooks';
// Components
import ImageCard from '../../components/cards/ImageCard';
import { ImageCardBack } from '../../components/cards';
import { translate } from '../../components/shared';

function DreamCard({
  cardId,
  cardWidth,
  isDream = false,
  isNightmare = false,
  flipped = false,
  hideBlurButton = false,
}) {
  const language = useLanguage();
  const [blurredCards, addBlurCard, isFlavia] = useBlurCards();

  const baseClass = 's-dream-board-card';

  if (flipped) {
    return <ImageCardBack className={baseClass} cardWidth={cardWidth} />;
  }

  return (
    <Fragment>
      {!hideBlurButton && isFlavia && (
        <Button ghost onClick={() => addBlurCard(cardId)} size="small">
          {translate('Credo', 'Blur', language)}
        </Button>
      )}
      <ImageCard
        imageId={cardId}
        bordered
        cardWidth={cardWidth}
        className={clsx(
          baseClass,
          isDream && `${baseClass}--dream`,
          isNightmare && `${baseClass}--nightmare`,
          blurredCards?.[cardId] && 'image-card-hand--blur'
        )}
      />
    </Fragment>
  );
}

DreamCard.propTypes = {
  cardId: PropTypes.string,
  cardWidth: PropTypes.number,
  flipped: PropTypes.bool,
  hideBlurButton: PropTypes.bool,
  isDream: PropTypes.bool,
  isNightmare: PropTypes.bool,
};

export default DreamCard;
