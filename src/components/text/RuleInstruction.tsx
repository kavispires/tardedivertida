import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import {
  AlertFilled,
  BulbFilled,
  ClockCircleFilled,
  ExclamationCircleFilled,
  MessageFilled,
  PlayCircleFilled,
  ReadFilled,
  RobotFilled,
  StarFilled,
} from '@ant-design/icons';
import { Typography, theme } from 'antd';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Sass
import './RuleInstruction.scss';

export type RuleInstructionProps = {
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
   * The type of the rule instruction (default: rule)
   * Rule is used for general rules
   * Action is used when the player must do something
   * Event is used when something happens like the result of an action or decision
   * Alert is used when something very important needs attention (constant animation)
   * Lore is used for story elements
   * Scoring for result points (not rule)
   * Wait for when the player must wait for something to happen
   */
  type: 'rule' | 'action' | 'event' | 'alert' | 'lore' | 'tip' | 'scoring' | 'wait' | 'bot';
  /**
   * Optional sound effect played when the component is rendered
   */
  sfx?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Typography container for rules instructions, if multiple lines, use <br /> to break lines
 * Do not use lists (ul, ol, li) inside this component
 * Add an icon on the left side
 */
export const RuleInstruction = ({
  children,
  className,
  fullWidth,
  type = 'rule',
  sfx,
  ...rest
}: RuleInstructionProps) => {
  const baseClass = 'rule-instruction';

  const icon = {
    action: <PlayCircleFilled />,
    alert: <AlertFilled />,
    event: <ExclamationCircleFilled />,
    lore: <MessageFilled />,
    rule: <ReadFilled />,
    tip: <BulbFilled />,
    scoring: <StarFilled />,
    wait: <ClockCircleFilled />,
    bot: <RobotFilled />,
  }[type];

  const animationClass = {
    action: getAnimationClass('shakeX'),
    alert: getAnimationClass('flash', { infinite: true, speed: 'fast' }),
    event: getAnimationClass('tada', { repeat: 3, speed: 'fast' }),
    lore: getAnimationClass('pulse'),
    rule: getAnimationClass('pulse'),
    tip: getAnimationClass('pulse'),
    scoring: getAnimationClass('pulse'),
    wait: getAnimationClass('pulse'),
    bot: getAnimationClass('pulse'),
  }[type];

  const { token } = theme.useToken();
  const color = type === 'action' ? { background: token.colorPrimary } : {};

  return (
    <div
      className={clsx(baseClass, fullWidth && `${baseClass}--full-width`, className)}
      data-testid="rule-instruction"
      {...rest}
    >
      <div
        className={clsx(`${baseClass}__icon`, `${baseClass}__icon--${type}`)}
        style={color}
      >
        <div className={animationClass}>{icon}</div>
      </div>
      {sfx}
      <Typography.Paragraph className={clsx(`${baseClass}__content`)}>{children}</Typography.Paragraph>
    </div>
  );
};
