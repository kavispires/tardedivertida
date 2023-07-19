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
};

export function TextHighlight({ children, className }: TextHighlightProps) {
  return <span className={clsx('text-highlight', className)}>{children}</span>;
}
