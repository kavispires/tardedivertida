import clsx from 'clsx';
import { Image } from 'antd';
import { PUBLIC_URL } from 'utils/constants';
import placeholder from 'assets/images/placeholder.jpg';
import { useBlurCards } from 'hooks';

type ImageCardProps = {
  imageId: string;
  size?: 'small' | 'medium' | 'large';
  cardWidth?: number;
  className?: string;
  preview?: Boolean;
};
export const ImageCard = ({
  imageId,
  size = 'medium',
  cardWidth = 200,
  className = '',
  preview = true,
}: ImageCardProps) => {
  const [blurredCards, , blurEnabled] = useBlurCards();

  const baseClass = 'image-card';

  const fallbackName = `placeholder-${imageId[imageId.length - 1]}`;

  const imageURL = imageId.replace(/-/g, '/');

  const isBlurred = blurEnabled && blurredCards?.[imageId];

  return (
    <div className={clsx(baseClass, `${baseClass}--${size}`, isBlurred && `${baseClass}--blur`, className)}>
      <Image
        width={cardWidth}
        src={`${process.env.REACT_APP_TDI_IMAGES_URL}${imageURL}.jpg`}
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
};

export default ImageCard;
