import clsx from 'clsx';
// Sass
import './TextHighlight.scss';

type TextHighlightProps = {
  /**
   * If the highlight should be dark
   */
  dark?: boolean;
} & ElementPropsWithChildren;

export function TextHighlight({ children, className, dark, ...props }: TextHighlightProps) {
  return (
    <span
      className={clsx('text-highlight', dark && 'text-highlight--dark', className)}
      {...props}
    >
      {children}
    </span>
  );
}
