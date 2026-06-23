import clsx from 'clsx';
import type { ReactNode } from 'react';
// Utils
import { getColorFromLetter } from '@utils/helpers';
// Sass
import styles from './TextCard.module.scss';

type TextCardProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Optional header (defaults to "C")
   */
  header?: ReactNode;
  /**
   * Optional footer
   */
  footer?: ReactNode;
  /**
   * Background color of the header
   * It can be a predefined color or a hex code (e.g. #ff0000)
   */
  color?: string;
  /**
   * Size of the card
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If true, the header color will be defined by the first letter of the children
   * (overrides the color prop)
   */
  randomColor?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Optional custom class slots
   */
  classNames?: {
    header?: string;
    body?: string;
    footer?: string;
  };
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Generic text card component with customizable header, footer, color, and size
 */
export const TextCard = ({
  children,
  header,
  footer,
  color = 'none',
  size = 'medium',
  randomColor = false,
  className,
  classNames = {},
  ...rest
}: TextCardProps) => {
  const determineColor = () => {
    if (!randomColor) return color;

    if (typeof children === 'string' && children.length > 0) {
      return getColorFromLetter(children[0].toUpperCase());
    }

    // ✨ Look how clean this is now! No more checking for "Carta" or "C"
    if (typeof header === 'string' && header.length > 0) {
      return getColorFromLetter(header[0].toUpperCase());
    }

    return getColorFromLetter('X');
  };

  const finalColor = determineColor();
  const isHexColor = finalColor.startsWith('#');

  return (
    <div
      className={clsx(styles.card, className)}
      data-size={size}
      {...rest}
    >
      {/* ✨ Renders ONLY if header is provided */}
      {header !== undefined && (
        <header
          className={clsx(
            styles.cardHeader,
            !isHexColor && `color-background--${finalColor}`,
            classNames.header,
          )}
          style={isHexColor ? { backgroundColor: finalColor } : undefined}
        >
          {header}
        </header>
      )}

      <div className={clsx(styles.cardText, classNames.body)}>{children}</div>

      {footer && <footer className={clsx(styles.cardFooter, classNames.footer)}>{footer}</footer>}
    </div>
  );
};
