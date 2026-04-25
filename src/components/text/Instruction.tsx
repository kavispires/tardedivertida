import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Sass
import styles from './Instruction.module.scss';

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
   * Makes instruction width 100%
   */
  fullWidth?: boolean;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Removes margin from the instruction
   */
  noMargin?: boolean;
  /**
   * Color scheme
   */
  colorScheme?: ColorScheme;
} & ComponentProps<typeof Typography.Text>;

/**
 * Typography container for instructions
 */
export const Instruction = ({
  children,
  className,
  contained,
  fullWidth,
  noMargin = false,
  colorScheme,
  ...rest
}: InstructionsProps) => {
  return (
    <Typography.Text
      className={clsx(
        styles.instruction,
        contained && styles.instructionContained,
        colorScheme === 'dark' && styles.instructionDark,
        fullWidth && `${styles.instruction}--full-width`,
        noMargin && styles.instructionNoMargin,
        className,
      )}
      data-testid="instruction"
      {...rest}
    >
      {children}
    </Typography.Text>
  );
};
