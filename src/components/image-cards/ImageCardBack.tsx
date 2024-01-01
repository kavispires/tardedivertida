import { ImageCard, ImageCardProps } from './ImageCard';

type ImageCardBackProps = Omit<ImageCardProps, 'id'> & { id?: ImageCardId };

export const ImageCardBack = ({ id = 'back-default', ...rest }: ImageCardBackProps) => {
  return <ImageCard id={id} {...rest} />;
};
