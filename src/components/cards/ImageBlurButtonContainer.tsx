import clsx from 'clsx';
// Components
import { ImageBlurButton } from './ImageBlurButton';

type ImageBlurButtonContainerProps = {
  cardId: string;
  className?: string;
  children: any;
  [key: string]: any;
};

export function ImageBlurButtonContainer({
  cardId,
  className,
  children,
  ...props
}: ImageBlurButtonContainerProps) {
  return (
    <div className={clsx('image-blur-button-container', className)} {...props}>
      {children}
      <ImageBlurButton cardId={cardId} />
    </div>
  );
}
