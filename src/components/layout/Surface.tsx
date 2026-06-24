import clsx from 'clsx';
import type { ReactNode } from 'react';
// Sass
import styles from './Surface.module.scss';

type SurfaceProps = {
  /**
   * The content to display
   */
  children: ReactNode;
  /**
   * Adds a semi-transparent background with padding and border radius
   */
  contained?: boolean;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Color scheme (light or dark)
   */
  colorScheme?: ColorScheme;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Flexible content container for displaying surface content with optional styling variants
 */
export const Surface = ({ children, className, contained, colorScheme, ...rest }: SurfaceProps) => {
  return (
    <div
      className={clsx(
        styles.surface,
        { [styles.surfaceContained]: contained },
        { [styles.surfaceDark]: colorScheme === 'dark' },
        className,
      )}
      data-testid="surface"
      {...rest}
    >
      {children}
    </div>
  );
};
