import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Sass
import './RuleInstruction.scss';
import { ExclamationCircleFilled, PlayCircleFilled, ReadFilled } from '@ant-design/icons';

type RuleInstructionsProps = {
  /**
   * The content of the rule instruction
   */
  children: ReactNode;
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
  type?: 'rule' | 'action' | 'event';
};

/**
 * Typography container for rules instructions, if multiple lines, use <br /> to break lines
 * Do not use lists (ul, ol, li) inside this component
 * Add an icon on the left side
 */
export const RuleInstruction = ({ children, className, fullWidth, type = 'rule' }: RuleInstructionsProps) => {
  const baseClass = 'rule-instruction';

  const icon = {
    rule: <ReadFilled />,
    action: <PlayCircleFilled />,
    event: <ExclamationCircleFilled />,
  }[type];

  return (
    <div
      className={clsx(baseClass, fullWidth && `${baseClass}--full-width`, className)}
      data-testid="rule-instruction"
    >
      <div className={clsx(`${baseClass}__icon`, `${baseClass}__icon--${type}`)}>{icon}</div>
      <Typography.Paragraph className={clsx(`${baseClass}__content`)}>{children}</Typography.Paragraph>
    </div>
  );
};
