import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Components
import { useGameAppearance } from 'components/session/GameInfoContext';
// Sass
import './Title.scss';

export type TitleProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * The color scheme of the title (@default: the game info appearance color scheme or light)
   */
  colorScheme?: ColorScheme;
  /**
   * Makes text white
   * @deprecated
   */
  white?: boolean;
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
  level?: 1 | 2 | 3 | 4 | 5;
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
  white,
  colorScheme,
  icon,
  className,
  level = 2,
  size = 'medium',
  align = 'center',
}: TitleProps) => {
  const appearance = useGameAppearance();
  const color = colorScheme ?? appearance.colorScheme ?? 'light';

  return (
    <Typography.Title
      level={level}
      className={clsx(
        'title',
        `title--${size}`,
        `title--align-${align}`,
        `title--${color}`,
        white && 'title--white',
        className
      )}
    >
      {Boolean(icon) && <span className="title__icon">{icon}</span>}
      {children}
    </Typography.Title>
  );
};
