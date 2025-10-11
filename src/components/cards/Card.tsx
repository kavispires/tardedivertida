import clsx from 'clsx';
import type { ReactNode } from 'react';
// Utils
import { getColorFromLetter } from 'utils/helpers';
// Sass
import './Card.scss';

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
};

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
}: CardProps) => {
  const baseClass = 'card';

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
    <div className={clsx(baseClass, `${baseClass}--${size}`, className)}>
      {!hideHeader && (
        <span
          className={clsx(`${baseClass}__header`, `color-background--${bgColor}`, headerClassName)}
          style={color.startsWith('#') ? { backgroundColor: color } : {}}
        >
          {header}
        </span>
      )}
      <span className={`${baseClass}__text`}>{children}</span>
      {footer && <span className={clsx(`${baseClass}__footer`, footerClassName)}>{footer}</span>}
    </div>
  );
};
