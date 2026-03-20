// Internal
import { ImageCard, type ImageCardProps } from './ImageCard';

type ImageCardBackProps = Omit<ImageCardProps, 'cardId'> & { cardId?: UID };

export const ImageCardBack = ({ cardId = 'back-default', ...rest }: ImageCardBackProps) => {
  return (
    <ImageCard
      cardId={cardId}
      {...rest}
    />
  );
};
