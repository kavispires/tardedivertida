import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Avatar as AntAvatar } from 'antd';
// Images
import avatars from '../../images/avatars.svg';
// Utils
import { AVAILABLE_AVATAR_IDS } from '../../utils/constants';

/**
 * Displays an Avatar svg image for given player
 */
export const Avatar = memo(function ({ id, size, shape, alt, className }) {
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
  /**
   * The alternate image text, usually the name of the user/player
   */
  alt: PropTypes.string,
  /**
   * A custom className
   */
  className: PropTypes.string,
  /**
   * The id of the avatar in the svg map
   */
  id: PropTypes.oneOf(AVAILABLE_AVATAR_IDS),
  /**
   * The shape of the avatar
   */
  shape: PropTypes.oneOf(['circle', 'square']),
  /**
   * The size of the avatar
   */
  size: PropTypes.oneOfType([PropTypes.oneOf(['large', 'small', 'default']), PropTypes.number]),
};

Avatar.defaultProps = {
  alt: 'Fulano',
  className: '',
  id: '25',
  shape: 'circle',
  size: 'large',
};
