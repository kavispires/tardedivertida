import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
// Resources
import placeholder from 'assets/images/placeholder.jpg';
import { useBlurCards } from 'hooks';

type ImageCardBackProps = {
  size?: 'small' | 'medium' | 'large';
  cardWidth?: number | string;
  className?: string;
  previewImageId?: string;
};

export const ImageCardBack = ({
  size = 'medium',
  cardWidth = 200,
  className = '',
  previewImageId,
}: ImageCardBackProps) => {
  const baseClass = 'image-card-back';
  const [blurredCards, , blurEnabled] = useBlurCards();
  const isBlurred = blurEnabled && previewImageId && blurredCards?.[previewImageId];
  const imageURL = (previewImageId ?? '').replace(/-/g, '/');

  return (
    <div className={clsx(baseClass, `${baseClass}--${size}`, className)}>
      <Image
        width={cardWidth}
        src={placeholder}
        preview={
          Boolean(previewImageId)
            ? !isBlurred
              ? {
                  maskClassName: 'image-card__preview-mask',
                  src: `${process.env.REACT_APP_TD_IMAGES_URL}${imageURL}.jpg`,
                }
              : false
            : false
        }
      />
    </div>
  );
};
