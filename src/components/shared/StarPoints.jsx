import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { StarFilled } from '@ant-design/icons';

function StarPoints({ quantity, keyPrefix, className = '' }) {
  if (!quantity || quantity < 1) {
    return <span></span>;
  }
  const starsArray = Array.from({ length: quantity }, (_, i) => <StarFilled key={`${keyPrefix}-${i}`} />);
  return (
    <span className={clsx('star-points', className)}>
      + <span className="star-points__stars">{starsArray}</span> point{quantity > 1 ? 's' : ''}
    </span>
  );
}

StarPoints.propTypes = {
  quantity: PropTypes.number,
  className: PropTypes.string,
  keyPrefix: PropTypes.string.isRequired,
};

export default memo(StarPoints);
