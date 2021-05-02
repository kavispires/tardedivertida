import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Resources
import allCards from '../../resources/arte-ruim-cards.json';

function Card({ id, title = 'Título' }) {
  const card = allCards[id];

  return (
    <div className="secret-word-card">
      <span className={`secret-word-card__title color-background--${title}`}>{title}</span>
      <span className="secret-word-card__text">{card?.text}</span>
      <span className="secret-word-card__level">{Array(card?.level).fill('•')}</span>
    </div>
  );
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default memo(Card);
