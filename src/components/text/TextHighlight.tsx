import clsx from 'clsx';
import { ReactNode } from 'react';
// Sass
import './TextHighlight.scss';

type TextHighlightProps = {
  /**
   * The text to be highlighted
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * If the highlight should be dark
   */
  dark?: boolean;
};

export function TextHighlight({ children, className, dark }: TextHighlightProps) {
  return (
    <span className={clsx('text-highlight', dark && 'text-highlight--dark', className)}>{children}</span>
  );
}
