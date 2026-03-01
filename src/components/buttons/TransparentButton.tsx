import clsx from 'clsx';
import type { ReactNode } from 'react';
import { isIOS } from 'react-device-detect';
// Sass
import styles from './TransparentButton.module.scss';

interface TransparentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The content of the button
   */
  children: ReactNode;
  /**
   * Flag indicating if the button is on its active state
   */
  active?: boolean;
  /**
   * Custom active class
   */
  activeClass?: string;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Behavior when the mouse hovers the button (default: scale)
   */
  hoverType?: 'scale' | 'sepia' | 'tint' | 'none';
}

/**
 * Transparent button that has all the functionality of a button but no visible styling
 */
export const TransparentButton = ({
  children,
  active = false,
  activeClass = '',
  className = '',
  hoverType = 'scale',
  ...rest
}: TransparentButtonProps) => {
  const hoverClass = !isIOS && hoverType !== 'none' ? styles[hoverType] : undefined;

  return (
    <button
      className={clsx(
        styles.transparentButton,
        hoverClass,
        active && (activeClass || styles.active),
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
