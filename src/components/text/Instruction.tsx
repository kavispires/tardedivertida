import clsx from 'clsx';
import { Typography } from 'antd';

type InstructionsProps = {
  children: any;
  white?: boolean;
  className?: string;
  contained?: boolean;
  fullWidth?: boolean;
};

/**
 * Typography container for instructions
 * @param props
 * @returns
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
