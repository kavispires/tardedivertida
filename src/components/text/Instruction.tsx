import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Sass
import './Instruction.scss';

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
  /**
   *
   */
  noMargin?: boolean;
};

/**
 * Typography container for instructions
 */
export const Instruction = ({
  children,
  white,
  className,
  contained,
  fullWidth,
  noMargin = false,
}: InstructionsProps) => {
  const baseClass = 'instruction';

  return (
    <Typography.Text
      className={clsx(
        baseClass,
        contained && `${baseClass}--contained`,
        white && `${baseClass}--white`,
        fullWidth && `${baseClass}--full-width`,
        noMargin && `${baseClass}--no-margin`,
        className
      )}
      data-testid="instruction"
    >
      {children}
    </Typography.Text>
  );
};
