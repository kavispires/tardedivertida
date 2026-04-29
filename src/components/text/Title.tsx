import type { TitleProps as AntdTitleProps } from 'antd/es/typography/Title';
import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { useGameAppearance } from 'components/session/GameInfoContext';
// Sass
import styles from './Title.module.scss';

export type TitleProps = Omit<AntdTitleProps, 'level'> & {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * The color scheme of the title (@default: the game info appearance color scheme or light)
   */
  colorScheme?: ColorScheme;
  /**
   * Icon prefixing the title
   */
  icon?: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * The heading level (@default: 2)
   */
  level?: AntdTitleProps['level'];
  /**
   * The size of the title (@default: medium)
   */
  size?: 'xx-small' | 'x-small' | 'small' | 'medium' | 'large';
  /**
   * The alignment of the text (@default: center)
   */
  align?: 'left' | 'right' | 'center';
};

/**
 * Game title component with optional icon, color scheme, and customizable size and alignment
 */
export const Title = ({
  children,
  colorScheme,
  icon,
  className,
  level = 2,
  size = 'medium',
  align = 'center',
  ...props
}: TitleProps) => {
  const appearance = useGameAppearance();
  const color = colorScheme ?? appearance.colorScheme ?? 'light';

  const sizeClass = {
    'xx-small': styles.titleXxSmall,
    'x-small': styles.titleXSmall,
    small: styles.titleSmall,
    medium: styles.titleMedium,
    large: styles.titleLarge,
  }[size];

  const alignClass = {
    left: styles.titleAlignLeft,
    right: styles.titleAlignRight,
    center: '',
  }[align];

  const colorClass = {
    light: styles.titleLight,
    dark: styles.titleDark,
    white: styles.titleWhite,
  }[color];

  return (
    <Typography.Title
      level={level}
      className={clsx(styles.title, sizeClass, alignClass, colorClass, className)}
      {...props}
    >
      {Boolean(icon) && (
        <span className={styles.titleIcon}>
          <IconAvatar icon={icon} />
        </span>
      )}
      {children}
    </Typography.Title>
  );
};
