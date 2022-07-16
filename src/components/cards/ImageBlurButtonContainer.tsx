import clsx from 'clsx';
import { ReactNode } from 'react';
// Components
import { ImageBlurButton } from './ImageBlurButton';

interface ImageBlurButtonContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  cardId: string;
  /**
   * The content the component is wrapping
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
}

export function ImageBlurButtonContainer({
  cardId,
  children,
  className = '',
  ...rest
}: ImageBlurButtonContainerProps) {
  return (
    <div className={clsx('image-blur-button-container', className)} {...rest}>
      {children}
      <ImageBlurButton cardId={cardId} />
    </div>
  );
}
