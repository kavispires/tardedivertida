import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
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
  preview?: Boolean;
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

  const booleanPreviewConfig =
    preview && !isBlurred
      ? {
          maskClassName: `${baseClass}__preview-mask`,
        }
      : false;

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
        // height={square ? cardWidth : undefined}
        src={`${baseUrl}/${imageURL}.${fileExtension}`}
        placeholder={<Image preview={false} src={placeholder} width={cardWidth} />}
        fallback={`${PUBLIC_URL.CARDS}${fallbackName}.jpg`}
        preview={
          Boolean(previewImageId)
            ? {
                src: `${baseUrl}/${previewImageId.replace(/-/g, '/')}.${fileExtension}`,
              }
            : booleanPreviewConfig
        }
      />
    </div>
  );
};
