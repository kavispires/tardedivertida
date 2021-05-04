import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { StarFilled } from '@ant-design/icons';

function StarPoints({ quantity, className = '' }) {
  if (!quantity || quantity < 1) {
    return <span></span>;
  }
  const starArrays = new Array(quantity).fill(<StarFilled />);
  return (
    <span className={clsx('star-points', className)}>
      + <span className="star-points__stars">{starArrays}</span> point{quantity > 1 ? 's' : ''}
    </span>
  );
}

StarPoints.propTypes = {
  quantity: PropTypes.number,
  className: PropTypes.string,
};

export default memo(StarPoints);
