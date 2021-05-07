import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Resources
import allWords from '../../resources/um-so-words.json';

function UmSoCard({ id, title = 'Carta', colorCode }) {
  const word = allWords[id];

  return (
    <div className="secret-word-card secret-word-card--large">
      <span className={`secret-word-card__title color-background--F`}>{title}</span>
      <span className="secret-word-card__text">{word}</span>
    </div>
  );
}

UmSoCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default memo(UmSoCard);
