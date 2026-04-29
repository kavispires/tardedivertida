import clsx from 'clsx';
// Sass
import styles from './TextHighlight.module.scss';

type TextHighlightProps = {
  /**
   * If the highlight should be dark
   */
  dark?: boolean;
} & ElementPropsWithChildren;

/**
 * Highlights text with a colored background, optionally using dark styling
 */
export function TextHighlight({ children, className, dark, ...props }: TextHighlightProps) {
  return (
    <span
      className={clsx(styles.textHighlight, dark && styles.textHighlightDark, className)}
      {...props}
    >
      {children}
    </span>
  );
}
