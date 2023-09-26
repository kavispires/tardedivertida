import { ImageCard, ImageCardProps } from './ImageCard';

type ImageCardBackProps = Omit<ImageCardProps, 'imageId'> & { imageId?: ImageCardId };

export const ImageCardBack = ({ imageId = 'back-default', ...rest }: ImageCardBackProps) => {
  return <ImageCard imageId={imageId} {...rest} />;
};
