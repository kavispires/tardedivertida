import clsx from 'clsx';
import { ComponentProps, ReactNode } from 'react';
// Sass
import './SpeechBubble.scss';

type SpeechBubbleProps = {
  children: ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  shadow?: boolean;
  size?: 'small' | 'medium' | 'large';
} & ComponentProps<'div'>;

export function SpeechBubble({ children, direction = 'left', shadow, size, ...rest }: SpeechBubbleProps) {
  const baseClass = 'speech-bubble';
  return (
    <div
      {...rest}
      className={clsx(
        baseClass,
        `${baseClass}--${direction}`,
        shadow && `${baseClass}--shadow`,
        size && `${baseClass}--${size}`
      )}
    >
      {children}
    </div>
  );
}
