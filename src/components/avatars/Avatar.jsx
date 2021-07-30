import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Avatar as AntAvatar } from 'antd';
// Images
import avatars from '../../images/avatars.svg';
// Hooks
import { useLanguage } from '../../hooks';
// Utils
import { AVAILABLE_AVATAR_IDS } from '../../utils/constants';
import { translate } from '../shared/Translate';

/**
 * Displays an Avatar svg image for given player
 */
export const Avatar = memo(function ({ id, size, shape, alt, className }) {
  const language = useLanguage();

  return (
    <AntAvatar
      className={clsx('avatar', className)}
      size={size}
      shape={shape}
      alt={alt ?? translate('Fulano', 'John Doe', language)}
      src={
        <svg viewBox="0 0 100 100">
          <use href={avatars + `#avatar-${id}`}></use>
        </svg>
      }
    />
  );
});

Avatar.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.oneOf(AVAILABLE_AVATAR_IDS),
  shape: PropTypes.oneOf(['circle', 'square']),
  size: PropTypes.oneOfType([PropTypes.oneOf(['large', 'small', 'default']), PropTypes.number]),
};

Avatar.defaultProps = {
  className: '',
  id: '25',
  shape: 'circle',
  size: 'large',
};
