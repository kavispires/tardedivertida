import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { Button, ButtonProps, Popover } from 'antd';
// Sass
import './FixedMenuButton.scss';

type FixedMenuButtonDefaultProps = {
  /**
   * What order it will show up in the screen
   * 0 for rules
   * 1 for extras (e.g. card size)
   * 2 for extras
   * 3 for rating
   * -1 for admin only
   */
  position: 0 | 1 | 2 | 3 | -1;
  /**
   * The displayed icon
   */
  icon: ReactNode;
  /**
   * The optional label to follow the icon when hover
   */
  label?: ReactNode;
  /**
   * The custom class
   */
  className?: string;
  /**
   * Determine if label should be visible
   */
  showLabel?: boolean;
  /**
   * Any ant design button props
   */
  buttonProps?: ButtonProps;
};

interface FixedMenuButtonPopoverProps extends FixedMenuButtonDefaultProps {
  /**
   * The type of the floater
   */
  type: 'popover';
  /**
   * Content of popover, required when popover rule
   */
  content: ReactNode;
  /**
   * Guard onclick from button only
   */
  onClick?: never;
  /**
   * If popover should be open
   */
  open?: boolean;
}

interface FixedMenuButtonButtonOnlyProps extends FixedMenuButtonDefaultProps {
  /**
   * The type of the floater
   */
  type: 'button';
  /**
   * The click function for the button
   */
  onClick: GenericFunction;
  /**
   * Guard content from popover
   */
  content?: never;
  /**
   * If popover should be open
   */
  open?: never;
}

type FixedMenuButtonProps = FixedMenuButtonPopoverProps | FixedMenuButtonButtonOnlyProps;

/**
 * Button position on the top left of the screen to display rules, admin button and other features
 */
export function FixedMenuButton({ type, position, content, className, open, ...rest }: FixedMenuButtonProps) {
  return (
    <div className={clsx('fixed-menu-button', `fixed-menu-button--${position}`, className)}>
      {type === 'popover' ? (
        <Popover placement="bottomLeft" content={content} trigger="click" open={open}>
          <FixedMenuButtonContent {...rest} />
        </Popover>
      ) : (
        <FixedMenuButtonContent {...rest} />
      )}
    </div>
  );
}

function FixedMenuButtonContent({
  icon,
  label,
  showLabel,
  onClick,
  buttonProps,
}: Partial<FixedMenuButtonProps>) {
  const [isActive, setActive] = useState(showLabel);
  const hasLabel = Boolean(label);

  useEffectOnce(() => {
    setActive(showLabel);
  });

  return (
    <Button
      shape={hasLabel && isActive ? 'round' : 'circle'}
      size="middle"
      onMouseOver={() => setActive(true)}
      onMouseLeave={() => setActive(showLabel ?? false)}
      onClick={onClick ? onClick : undefined}
      icon={icon}
      ghost
      type="primary"
      {...buttonProps}
    >
      {isActive && hasLabel && <span className="fixed-menu-button__label">{label}</span>}
    </Button>
  );
}
