import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Image } from 'antd';
import { PUBLIC_URL } from '../../utils/constants';

export const ImageCard = memo(function ({ imageId, size, cardWidth, className }) {
  const baseClass = 'image-card';

  const fallbackName = `placeholder-${imageId[imageId.length - 1]}`;

  const imageURL = imageId.replace(/-/g, '/');

  return (
    <div className={clsx(baseClass, `${baseClass}--${size}`, className)}>
      <Image
        width={cardWidth}
        src={`${process.env.REACT_APP_IMG_URL}${imageURL}.jpg`}
        fallback={`${PUBLIC_URL.CARDS}${fallbackName}.jpg`}
        preview={{
          maskClassName: `${baseClass}__preview-mask`,
        }}
      />
    </div>
  );
});

ImageCard.propTypes = {
  imageId: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  bordered: PropTypes.bool,
  cardWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

ImageCard.defaultProps = {
  size: 'medium',
  className: '',
  bordered: false,
  cardWidth: 200,
};

export default memo(ImageCard);
