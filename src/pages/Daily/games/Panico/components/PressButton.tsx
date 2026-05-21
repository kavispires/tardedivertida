import clsx from 'clsx';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type PressButtonProps = {
  /**
   * Callback function when button is pressed
   */
  onPress: () => void;
  /**
   * Content to display inside the button
   */
  children: ReactNode;
  /**
   * Number of times the button has been pressed
   */
  pressCount: number;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   *
   */
  size?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Round interactive button that tracks press count and provides visual feedback
 */
export function PressButton({
  onPress,
  children,
  pressCount,
  disabled = false,
  size = 300,
  className,
  ...props
}: PressButtonProps) {
  return (
    <button
      style={{ width: size * 0.9, height: size * 0.9 }} // Button is 80% of the puzzle size
      className={clsx('btn-container', className)}
      onClick={onPress}
      {...props}
    >
      <motion.span // Changed to span: divs are invalid inside buttons
        className="btn-face"
        initial={{ y: -15 }}
        whileTap={{ y: 0 }}
        whileHover={{ y: -18 }}
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 20,
        }}
      >
        {children}
      </motion.span>
    </button>
  );
}
