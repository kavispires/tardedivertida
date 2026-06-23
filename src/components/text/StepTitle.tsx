import type { TitleProps } from 'antd/es/typography/Title';
import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { type AvatarProps, Typography } from 'antd';
// Icons
import { AnimatedClockIcon } from '@icons/AnimatedClockIcon';
// Components
import { Icon } from '@components/general/Icon';
import { useGameAppearance } from '@components/session/GameInfoContext';
// Sass
import styles from './StepTitle.module.scss';

export type StepTitleProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * The color scheme of the title (@default: the game info appearance color scheme or light)
   */
  colorScheme?: ColorScheme;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * The size of the title (@default: medium)
   */
  size?: AvatarProps['size'];
  /**
   * Icon prefixing the title
   */
  icon?: ReactNode;
  /**
   * Adds animated clock icon to the title (overrides icon)
   */
  wait?: boolean;
} & TitleProps;

/**
 * Title component for game steps with optional icon and animated clock indicator
 */
export const StepTitle = ({
  colorScheme,
  children,
  icon,
  className,
  size = 'default',
  wait,
  level,
  ...props
}: StepTitleProps) => {
  const appearance = useGameAppearance();
  const color = colorScheme ?? appearance.colorScheme ?? 'light';

  const sizeClass =
    {
      large: styles.stepTitleLarge,
      default: styles.stepTitleDefault,
      small: styles.stepTitleSmall,
    }[size as string] || '';

  const colorClass = {
    light: styles.stepTitleLight,
    dark: styles.stepTitleDark,
  }[color];

  return (
    <Typography.Title
      level={level ?? 2}
      className={clsx(styles.stepTitle, sizeClass, colorClass, className)}
      {...props}
    >
      {(!!icon || wait) && (
        <span className={styles.stepTitleIcon}>
          <Icon
            size={size}
            icon={wait ? <AnimatedClockIcon /> : icon}
          />
        </span>
      )}
      {children}
    </Typography.Title>
  );
};
