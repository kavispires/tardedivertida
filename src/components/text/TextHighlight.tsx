import { ReactNode } from 'react';

type TextHighlightProps = {
  /**
   * The text to be highlighted
   */
  children: ReactNode;
};

export function TextHighlight({ children }: TextHighlightProps) {
  return <span className="text-highlight">{children}</span>;
}
