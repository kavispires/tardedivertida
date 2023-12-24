import clsx from 'clsx';
// Ant Design Resources
import { Image, ImageProps } from 'antd';
// Constants
import { PUBLIC_URL } from 'utils/constants';
// Assets
import placeholder from 'assets/images/placeholder.jpg';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Sass
import './ImageCard.scss';

export type ImageCardProps = {
  /**
   * The id of the image
   */
  imageId: string;
  /**
   * The width of the card (Default: 200px)
   */
  cardWidth?: number;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Enables or disables the preview (default: true)
   */
  preview?: ImageProps['preview'];
  /**
   * Replacement image when the preview is open
   */
  previewImageId?: string;
  /**
   * The file extension for the image (default: jpg)
   */
  fileExtension?: 'jpg' | 'png' | 'gif';
  /**
   * Forces height to be the same as the width
   */
  square?: boolean;
};

/**
 * Renders an Image Card on tdi
 */
export const ImageCard = ({
  imageId,
  cardWidth = 200,
  className = '',
  preview = true,
  previewImageId = '',
  fileExtension = 'jpg',
  square = false,
}: ImageCardProps) => {
  const { shouldBeBlurred } = useBlurCards();
  const baseUrl = useTDBaseUrl('tdi');

  const baseClass = 'image-card';

  const fallbackName = `placeholder-${imageId[imageId.length - 1]}`;

  const imageURL = imageId.replace(/-/g, '/');

  const isBlurred = shouldBeBlurred(imageId);

  const previewConfig = typeof preview === 'boolean' ? {} : preview;

  return (
    <div
      className={clsx(
        baseClass,
        isBlurred && `${baseClass}--blur`,
        square && `${baseClass}--square`,
        className
      )}
      style={{ height: square ? `${cardWidth}px` : undefined }}
    >
      <Image
        width={cardWidth}
        src={`${baseUrl}/${imageURL}.${fileExtension}`}
        placeholder={<Image preview={false} src={placeholder} width={cardWidth} />}
        fallback={`${PUBLIC_URL.CARDS}${fallbackName}.jpg`}
        preview={
          isBlurred || !preview
            ? false
            : {
                ...previewConfig,
                maskClassName: clsx(`${baseClass}__preview-mask`, previewConfig?.maskClassName),
                src: Boolean(previewImageId)
                  ? `${baseUrl}/${previewImageId.replace(/-/g, '/')}.${fileExtension}`
                  : previewConfig?.src,
              }
        }
      />
    </div>
  );
};
