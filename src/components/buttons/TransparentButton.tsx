import clsx from 'clsx';
import type { ReactNode } from 'react';
import { isIOS } from 'react-device-detect';
// Sass
import './TransparentButton.scss';

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
  return (
    <button
      className={clsx(
        'transparent-button',
        `transparent-button--${isIOS ? 'none' : hoverType}`,
        active && (activeClass || 'transparent-button--active'),
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
