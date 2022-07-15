import clsx from 'clsx';
import { Typography } from 'antd';
import { ReactNode } from 'react';

type InstructionsProps = {
  /**
   * The content of the instruction
   */
  children: ReactNode;
  /**
   * Adds a semi transparent background (white or black opposite to the white property)
   */
  contained?: boolean;
  /**
   * Make text color white
   */
  white?: boolean;
  /**
   * Makes instruction width 100%
   */
  fullWidth?: boolean;
  /**
   * Custom class name
   */
  className?: string;
};

/**
 * Typography container for instructions
 */
export const Instruction = ({ children, white, className, contained, fullWidth }: InstructionsProps) => {
  const baseClass = 'instruction';

  return (
    <Typography.Text
      className={clsx(
        baseClass,
        contained && `${baseClass}--contained`,
        white && `${baseClass}--white`,
        fullWidth && `${baseClass}--full-width`,
        className
      )}
      data-testid="instruction"
    >
      {children}
    </Typography.Text>
  );
};
