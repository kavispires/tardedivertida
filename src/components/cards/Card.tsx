import clsx from 'clsx';
import type { ReactNode } from 'react';
// Utils
import { getColorFromLetter } from '@utils/helpers';
// Sass
import styles from './Card.module.scss';

type CardProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Optional header (defaults to "C")
   */
  header?: string | ReactNode;
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
   * Optional custom class name for the header
   */
  headerClassName?: string;
  /**
   * Optional custom class name for the footer
   */
  footerClassName?: string;
  /**
   * If true, the header will be hidden
   */
  hideHeader?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Generic card component with customizable header, footer, color, and size
 */
export const Card = ({
  children,
  header = 'Carta',
  footer,
  color = 'none',
  size = 'medium',
  randomColor = false,
  className = '',
  headerClassName = '',
  footerClassName = '',
  hideHeader = false,
  ...rest
}: CardProps) => {
  const bgColor = randomColor
    ? getColorFromLetter(
        typeof children === 'string'
          ? children[0].toUpperCase()
          : header !== 'C' && typeof header === 'string'
            ? header[0].toUpperCase()
            : 'X',
      )
    : color;

  return (
    <div
      className={clsx(
        styles.card,
        size === 'small' && styles.cardSmall,
        size === 'large' && styles.cardLarge,
        className,
      )}
      {...rest}
    >
      {!hideHeader && (
        <span
          className={clsx(
            styles.cardHeader,
            size === 'large' && styles.cardHeaderLarge,
            size === 'small' && styles.cardHeaderSmall,
            `color-background--${bgColor}`,
            headerClassName,
          )}
          style={color.startsWith('#') ? { backgroundColor: color } : {}}
        >
          {header}
        </span>
      )}
      <span
        className={clsx(
          styles.cardText,
          size === 'large' && styles.cardTextLarge,
          size === 'small' && styles.cardTextSmall,
        )}
      >
        {children}
      </span>
      {footer && (
        <span
          className={clsx(styles.cardFooter, size === 'large' && styles.cardFooterLarge, footerClassName)}
        >
          {footer}
        </span>
      )}
    </div>
  );
};
