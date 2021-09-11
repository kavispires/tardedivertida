import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Image } from 'antd';
// Resources
import placeholder from '../../images/placeholder.jpg';

export const ImageCardBack = memo(function ({ size, cardWidth, className }) {
  const baseClass = 'image-card-back';

  return (
    <div className={clsx(baseClass, `${baseClass}--${size}`, className)}>
      <Image width={cardWidth} src={placeholder} preview={false} />
    </div>
  );
});

ImageCardBack.propTypes = {
  cardWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

ImageCardBack.defaultProps = {
  cardWidth: 200,
  className: '',
  size: 'medium',
};

export default memo(ImageCardBack);
