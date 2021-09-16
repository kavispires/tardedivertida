import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Image } from 'antd';
import { PUBLIC_URL } from '../../utils/constants';
import placeholder from '../../images/placeholder.jpg';
import { useBlurCards } from '../../hooks';

export const ImageCard = memo(function ({ imageId, size, cardWidth, className, preview }) {
  const [blurredCards, blurEnabled] = useBlurCards();

  const baseClass = 'image-card';

  const fallbackName = `placeholder-${imageId[imageId.length - 1]}`;

  const imageURL = imageId.replace(/-/g, '/');

  const isBlurred = blurEnabled && blurredCards?.[imageId];

  return (
    <div className={clsx(baseClass, `${baseClass}--${size}`, isBlurred && `${baseClass}--blur`, className)}>
      <Image
        width={cardWidth}
        src={`${process.env.REACT_APP_IMG_URL}${imageURL}.jpg`}
        placeholder={<Image preview={false} src={placeholder} width={cardWidth} />}
        fallback={`${PUBLIC_URL.CARDS}${fallbackName}.jpg`}
        preview={
          preview && !isBlurred
            ? {
                maskClassName: `${baseClass}__preview-mask`,
              }
            : false
        }
      />
    </div>
  );
});

ImageCard.propTypes = {
  bordered: PropTypes.bool,
  cardWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  imageId: PropTypes.string.isRequired,
  preview: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

ImageCard.defaultProps = {
  size: 'medium',
  className: '',
  bordered: false,
  cardWidth: 200,
  preview: true,
};

export default memo(ImageCard);
