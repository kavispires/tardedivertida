import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { ArrowLeftOutlined, ArrowRightOutlined, MinusOutlined } from '@ant-design/icons';
import { LETTERS } from '../../../utils/constants';
import clsx from 'clsx';

const getColorModifier = (letter) => {
  const index = LETTERS.indexOf(letter);
  return Math.abs(index) % 4;
};

function Card({ left, right, className }) {
  const leftColor = getColorModifier(left[0]);
  const rightColor = getColorModifier(right[0]);
  const cardSideClass = 'o-card__side';

  return (
    <div className={clsx('o-card', className)}>
      <div className={clsx(cardSideClass, `${cardSideClass}--left`, `${cardSideClass}--L${leftColor}`)}>
        <span className="o-card__arrow">
          <ArrowLeftOutlined /> <MinusOutlined /> <MinusOutlined />
        </span>
        <span className="o-card__text">{left}</span>
      </div>
      <div className={clsx(cardSideClass, `${cardSideClass}--right`, `${cardSideClass}--R${rightColor}`)}>
        <span className="o-card__arrow">
          <MinusOutlined /> <MinusOutlined /> <ArrowRightOutlined />
        </span>
        <span className="o-card__text">{right}</span>
      </div>
    </div>
  );
}

Card.propTypes = {
  left: PropTypes.string.isRequired,
  right: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Card.defaultProps = {
  cardName: '',
};

export default memo(Card);
