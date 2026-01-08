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
  cardId: string;
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
} & ElementProps;

/**
 * Renders an Image Card on tdi
 */
export const ImageCard = ({
  cardId,
  cardWidth = 200,
  className = '',
  preview = true,
  previewImageId = '',
  fileExtension = 'jpg',
  square = false,
  classic = false,
  ...rest
}: ImageCardProps) => {
  const { shouldBeBlurred } = useBlurCards();
  const baseUrl = useTDBaseUrl(classic ? 'classic' : 'images');

  const baseClass = 'image-card';

  const { imageURL, fallbackName } = useMemo(() => {
    const imageURL = cardId.replace(/-/g, '/');
    const numId = Number(imageURL?.split('/')?.at(-1) ?? cardId[cardId.length - 1]) % 12;

    const fallbackName = `placeholder-${numId}`;
    return {
      imageURL,
      fallbackName,
    };
  }, [cardId]);

  const isBlurred = shouldBeBlurred(cardId);

  const previewConfig = typeof preview === 'boolean' ? {} : preview;

  return (
    <div
      {...rest}
      className={clsx(
        baseClass,
        isBlurred && `${baseClass}--blur`,
        square && `${baseClass}--square`,
        className,
      )}
      style={{ ...rest.style, height: square ? `${cardWidth}px` : rest.style?.height }}
    >
      <Image
        width={cardWidth}
        src={`${baseUrl}/${imageURL}.${fileExtension}`}
        placeholder={<Image preview={false} src={placeholder} width={cardWidth} />}
        fallback={`${PUBLIC_URL.CARDS}${fallbackName}.jpg`}
        classNames={{
          cover: clsx(`${baseClass}__preview-mask`),
        }}
        preview={
          isBlurred || !preview
            ? false
            : {
                ...previewConfig,
                src: previewImageId
                  ? `${baseUrl}/${previewImageId.replace(/-/g, '/')}.${fileExtension}`
                  : previewConfig?.src,
              }
        }
      />
    </div>
  );
};
