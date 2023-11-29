import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { Typography, theme } from 'antd';
import {
  AlertFilled,
  BulbFilled,
  ExclamationCircleFilled,
  MessageFilled,
  PlayCircleFilled,
  ReadFilled,
} from '@ant-design/icons';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Sass
import './RuleInstruction.scss';

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
   * The type of the rule instruction (default: rule)
   * Rule is used for general rules
   * Action is used when the player must do something
   * Event is used when something happens like the result of an action or decision
   * Alert is used when something very important needs attention
   * Lore is used for story elements
   */
  type?: 'rule' | 'action' | 'event' | 'alert' | 'lore' | 'tip';
  /**
   * Optional sound effect played when the component is rendered
   */
  sfx?: ReactNode;
};

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
}: RuleInstructionsProps) => {
  const baseClass = 'rule-instruction';

  const icon = {
    action: <PlayCircleFilled />,
    alert: <AlertFilled />,
    event: <ExclamationCircleFilled />,
    lore: <MessageFilled />,
    rule: <ReadFilled />,
    tip: <BulbFilled />,
  }[type];

  const animationClass = {
    action: getAnimationClass('shakeX'),
    alert: getAnimationClass('flash', { infinite: true, speed: 'fast' }),
    event: getAnimationClass('tada', { repeat: 3, speed: 'fast' }),
    lore: getAnimationClass('pulse'),
    rule: getAnimationClass('pulse'),
    tip: getAnimationClass('pulse'),
  }[type];

  const { token } = theme.useToken();
  const color = type === 'action' ? { background: token.colorPrimary } : {};

  return (
    <div
      className={clsx(baseClass, fullWidth && `${baseClass}--full-width`, className)}
      data-testid="rule-instruction"
    >
      <div className={clsx(`${baseClass}__icon`, `${baseClass}__icon--${type}`)} style={color}>
        <div className={animationClass}>{icon}</div>
      </div>
      {sfx}
      <Typography.Paragraph className={clsx(`${baseClass}__content`)}>{children}</Typography.Paragraph>
    </div>
  );
};
