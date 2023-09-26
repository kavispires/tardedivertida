import clsx from 'clsx';
import { ReactNode } from 'react';
// Components
import { ImageBlurButton } from './ImageBlurButton';
// Sass
import './ImageBlurButtonContainer.scss';

interface ImageBlurButtonContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The card to be blurred
   */
  cardId: string;
  /**
   * The content the component is wrapping
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * The position of the button (default: bottom)
   */
  position?: 'top' | 'bottom';
}

export function ImageBlurButtonContainer({
  cardId,
  children,
  className = '',
  position = 'bottom',
  ...rest
}: ImageBlurButtonContainerProps) {
  return (
    <div className={clsx('image-blur-button-container', className)} {...rest}>
      {position === 'top' && <ImageBlurButton cardId={cardId} />}
      {children}
      {position === 'bottom' && <ImageBlurButton cardId={cardId} />}
    </div>
  );
}
