// Internal
import { ImageCard, type ImageCardProps } from './ImageCard';

type ImageCardBackProps = Omit<ImageCardProps, 'cardId'> & { cardId?: UID };

/**
 * Wrapper component that renders the back side of an image card with a default card ID
 */
export const ImageCardBack = ({ cardId = 'back-default', ...rest }: ImageCardBackProps) => {
  return (
    <ImageCard
      cardId={cardId}
      {...rest}
    />
  );
};
