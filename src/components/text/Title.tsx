import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Sass
import './Title.scss';

export type TitleProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Makes text white
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
   * The heading level (default: 2)
   */
  level?: 1 | 2 | 3 | 4 | 5;
  /**
   * The size of the title (default: medium)
   */
  size?: 'xx-small' | 'x-small' | 'small' | 'medium' | 'large';
  /**
   * The alignment of the text (default: center)
   */
  align?: 'left' | 'right' | 'center';
};

export const Title = ({
  children,
  white,
  icon,
  className,
  level = 2,
  size = 'medium',
  align = 'center',
}: TitleProps) => {
  return (
    <Typography.Title
      level={level}
      className={clsx('title', `title--${size}`, `title--align-${align}`, white && 'title--white', className)}
    >
      {Boolean(icon) && icon}
      {children}
    </Typography.Title>
  );
};
