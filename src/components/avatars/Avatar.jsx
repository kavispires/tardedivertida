import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Avatar as AntAvatar } from 'antd';
// Images
import avatars from '../../images/avatars.svg';

export const Avatar = memo(function ({
  id = 25,
  size = 'large',
  shape = 'circle',
  alt = 'Fulano',
  className = '',
}) {
  return (
    <AntAvatar
      className={clsx('avatar', className)}
      size={size}
      shape={shape}
      alt={alt}
      src={
        <svg viewBox="0 0 100 100">
          <use href={avatars + `#avatar-${id}`}></use>
        </svg>
      }
    />
  );
});

Avatar.propTypes = {
  id: PropTypes.number,
  className: PropTypes.string,
  size: PropTypes.string,
  shape: PropTypes.string,
  alt: PropTypes.string,
};
