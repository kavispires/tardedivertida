import clsx from 'clsx';
import { ReactNode } from 'react';
// Utils
import { getColorFromLetter } from 'utils/helpers';
// Sass
import './Card.scss';

type CardProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  header?: string;
  footer?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  randomColor?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
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
}: CardProps) => {
  const baseClass = 'card';

  const bgColor = randomColor
    ? getColorFromLetter(
        typeof children === 'string'
          ? children[0].toUpperCase()
          : header !== 'Carta'
          ? header[0].toUpperCase()
          : 'X'
      )
    : color;

  return (
    <div className={clsx(baseClass, `${baseClass}--${size}`, className)}>
      <span
        className={clsx(`${baseClass}__header`, `color-background--${bgColor}`, headerClassName)}
        style={color.startsWith('#') ? { backgroundColor: color } : {}}
      >
        {header}
      </span>
      <span className={`${baseClass}__text`}>{children}</span>
      {footer && <span className={clsx(`${baseClass}__footer`, footerClassName)}>{footer}</span>}
    </div>
  );
};
