import { ReactNode } from 'react';
import clsx from 'clsx';
// Sass
import './SpeechBubble.scss';

type SpeechBubbleProps = {
  children: ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  shadow?: boolean;
  size?: 'small' | 'medium' | 'large';
};

export function SpeechBubble({ children, direction = 'left', shadow, size }: SpeechBubbleProps) {
  const baseClass = 'speech-bubble';
  return (
    <div
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
