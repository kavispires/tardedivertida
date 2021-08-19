import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Images
import sheep from '../../images/sheep.svg';

export const SheepAvatar = memo(function ({ id = '25', animate, className = '', width = 100, ...props }) {
  const baseClass = 'sheep-avatar';
  return (
    <svg
      viewBox="0 0 100 155"
      className={clsx(baseClass, animate && `${baseClass}--bounce`, className)}
      style={{ animationDuration: `${2000 + (Math.random() + Number(id)) * 100}ms`, width: `${width}px` }}
      {...props}
    >
      <use href={sheep + `#sheep-avatar-${id}`}></use>
    </svg>
  );
});

SheepAvatar.propTypes = {
  id: PropTypes.string,
  animate: PropTypes.bool,
  width: PropTypes.number,
  className: PropTypes.string,
};
