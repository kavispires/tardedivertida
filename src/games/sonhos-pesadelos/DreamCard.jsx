import PropTypes from 'prop-types';
import clsx from 'clsx';
// Components
import { ImageCard, ImageBlurButton, ImageCardBack } from '../../components';

export function DreamCard({
  cardId,
  cardWidth,
  isDream = false,
  isNightmare = false,
  flipped = false,
  hideBlurButton = false,
}) {
  const baseClass = 's-dream-board-card';

  if (flipped) {
    return <ImageCardBack className={baseClass} cardWidth={cardWidth} />;
  }

  return (
    <>
      <ImageCard
        imageId={cardId}
        bordered
        cardWidth={cardWidth}
        className={clsx(
          baseClass,
          isDream && `${baseClass}--dream`,
          isNightmare && `${baseClass}--nightmare`
        )}
      />
      {!hideBlurButton && <ImageBlurButton cardId={cardId} />}
    </>
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
