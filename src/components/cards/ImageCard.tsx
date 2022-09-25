import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
// Constants
import { PUBLIC_URL } from 'utils/constants';
// Assets
import placeholder from 'assets/images/placeholder.jpg';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';

type ImageCardProps = {
  imageId: string;
  size?: 'small' | 'medium' | 'large';
  cardWidth?: number;
  /**
   * Optional custom class name
   */
  className?: string;
  preview?: Boolean;
  previewImageId?: string;
};
export const ImageCard = ({
  imageId,
  size = 'medium',
  cardWidth = 200,
  className = '',
  preview = true,
  previewImageId = '',
}: ImageCardProps) => {
  const { shouldBeBlurred } = useBlurCards();

  const baseClass = 'image-card';

  const fallbackName = `placeholder-${imageId[imageId.length - 1]}`;

  const imageURL = imageId.replace(/-/g, '/');

  const isBlurred = shouldBeBlurred(imageId);

  const booleanPreviewConfig =
    preview && !isBlurred
      ? {
          maskClassName: `${baseClass}__preview-mask`,
        }
      : false;

  return (
    <div className={clsx(baseClass, `${baseClass}--${size}`, isBlurred && `${baseClass}--blur`, className)}>
      <Image
        width={cardWidth}
        src={`${process.env.REACT_APP_TDI_IMAGES_URL}${imageURL}.jpg`}
        placeholder={<Image preview={false} src={placeholder} width={cardWidth} />}
        fallback={`${PUBLIC_URL.CARDS}${fallbackName}.jpg`}
        preview={
          Boolean(previewImageId)
            ? {
                src: `${process.env.REACT_APP_TDI_IMAGES_URL}${previewImageId.replace(/-/g, '/')}.jpg`,
              }
            : booleanPreviewConfig
        }
      />
    </div>
  );
};
