import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
// Sass
import styles from './SpeechBubble.module.scss';

type SpeechBubbleProps = {
  children: ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  shadow?: boolean;
  size?: 'small' | 'medium' | 'large';
} & ComponentProps<'div'>;

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
