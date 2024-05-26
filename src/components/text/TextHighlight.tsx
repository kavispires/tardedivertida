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
   * Use reverse colors
   */
  negative?: boolean;
};

export function TextHighlight({ children, className, negative }: TextHighlightProps) {
  return (
    <span className={clsx('text-highlight', negative && 'text-highlight--negative', className)}>
      {children}
    </span>
  );
}
