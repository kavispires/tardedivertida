import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { Image, type ImageProps } from 'antd';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Images
import placeholder from 'assets/images/placeholder.jpg';
// Sass
import './ImageCard.scss';
// Assets

export type ImageCardProps = {
  /**
   * The id of the image
   */
  id: string;
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
  /**
   * Use classic image library
   */
  classic?: boolean;
};

/**
 * Renders an Image Card on tdi
 */
export const ImageCard = ({
  id,
  cardWidth = 200,
  className = '',
  preview = true,
  previewImageId = '',
  fileExtension = 'jpg',
  square = false,
  classic = false,
}: ImageCardProps) => {
  const { shouldBeBlurred } = useBlurCards();
  const baseUrl = useTDBaseUrl(classic ? 'classic' : 'images');

  const baseClass = 'image-card';

  const { imageURL, fallbackName } = useMemo(() => {
    const imageURL = id.replace(/-/g, '/');
    const numId = Number(imageURL?.split('/')?.at(-1) ?? id[id.length - 1]) % 12;

    const fallbackName = `placeholder-${numId}`;
    return {
      imageURL,
      fallbackName,
    };
  }, [id]);

  const isBlurred = shouldBeBlurred(id);

  const previewConfig = typeof preview === 'boolean' ? {} : preview;

  return (
    <div
      className={clsx(
        baseClass,
        isBlurred && `${baseClass}--blur`,
        square && `${baseClass}--square`,
        className,
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
                src: previewImageId
                  ? `${baseUrl}/${previewImageId.replace(/-/g, '/')}.${fileExtension}`
                  : previewConfig?.src,
              }
        }
      />
    </div>
  );
};
