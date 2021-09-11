import PropTypes from 'prop-types';
import React from 'react';
// Components
import ImageCard from './ImageCard';

export function ImageCardPreloadHand({ hand }) {
  if (!hand) return <span></span>;
  return (
    <div className="image-card-preload-hand">
      {hand.map((cardId) => (
        <ImageCard imageId={cardId} cardWidth={1} key={`pre-load-${cardId}`} />
      ))}
    </div>
  );
}

ImageCardPreloadHand.propTypes = {
  hand: PropTypes.arrayOf(PropTypes.string),
};
