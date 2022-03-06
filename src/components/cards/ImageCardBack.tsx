import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
// Resources
import placeholder from 'images/placeholder.jpg';

type ImageCardBackProps = {
  size?: 'small' | 'medium' | 'large';
  cardWidth?: number | string;
  className?: string;
};

export const ImageCardBack = ({ size = 'medium', cardWidth = 200, className = '' }: ImageCardBackProps) => {
  const baseClass = 'image-card-back';

  return (
    <div className={clsx(baseClass, `${baseClass}--${size}`, className)}>
      <Image width={cardWidth} src={placeholder} preview={false} />
    </div>
  );
};
