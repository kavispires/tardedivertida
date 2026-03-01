import clsx from 'clsx';
import type { ReactNode } from 'react';
// Internal
import { ImageBlurButton } from './ImageBlurButton';
// Sass
import styles from './ImageBlurButtonContainer.module.scss';

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
  /**
   * Determines if the button is ghost or not (default: true)
   */
  ghost?: boolean;
}

export function ImageBlurButtonContainer({
  cardId,
  children,
  className = '',
  position = 'bottom',
  ghost = true,
  ...rest
}: ImageBlurButtonContainerProps) {
  return (
    <div
      className={clsx(styles.imageBlurButtonContainer, className)}
      {...rest}
    >
      {position === 'top' && (
        <ImageBlurButton
          cardId={cardId}
          ghost={ghost}
        />
      )}
      {children}
      {position === 'bottom' && (
        <ImageBlurButton
          cardId={cardId}
          ghost={ghost}
        />
      )}
    </div>
  );
}
