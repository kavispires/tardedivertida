import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
// Sass
import styles from './SpeechBubble.module.scss';

type SpeechBubbleProps = {
  /**
   * The content to display inside the speech bubble
   */
  children: ReactNode;
  /**
   * The direction the speech bubble points
   */
  direction?: 'left' | 'right' | 'top' | 'bottom';
  /**
   * Whether to apply a shadow effect
   */
  shadow?: boolean;
  /**
   * The size of the speech bubble
   */
  size?: 'small' | 'medium' | 'large';
} & ComponentProps<'div'>;

/**
 * Speech bubble component with customizable direction, shadow, and size
 */
export function SpeechBubble({ children, direction = 'left', shadow, size, ...rest }: SpeechBubbleProps) {
  const directionClass = {
    left: styles.speechBubbleLeft,
    right: styles.speechBubbleRight,
    top: styles.speechBubbleTop,
    bottom: styles.speechBubbleBottom,
  }[direction];

  const sizeClass = size
    ? {
        small: styles.speechBubbleSmall,
        medium: styles.speechBubbleMedium,
        large: styles.speechBubbleLarge,
      }[size]
    : '';

  return (
    <div
      {...rest}
      className={clsx(styles.speechBubble, directionClass, shadow && styles.speechBubbleShadow, sizeClass)}
    >
      {children}
    </div>
  );
}
