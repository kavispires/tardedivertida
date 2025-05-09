import type { TitleProps as AntdTitleProps } from 'antd/es/typography/Title';
import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Components
import { IconAvatar } from 'components/avatars';
import { useGameAppearance } from 'components/session/GameInfoContext';
// Sass
import './Title.scss';

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

  return (
    <Typography.Title
      level={level}
      className={clsx('title', `title--${size}`, `title--align-${align}`, `title--${color}`, className)}
      {...props}
    >
      {Boolean(icon) && (
        <span className="title__icon">
          <IconAvatar icon={icon} />
        </span>
      )}
      {children}
    </Typography.Title>
  );
};
