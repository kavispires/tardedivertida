import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Sass
import './Title.scss';

type TitleProps = {
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
   * The heading level
   */
  level?: 1 | 2 | 3 | 4 | 5;
  /**
   * The size of the title
   */
  size?: 'xx-small' | 'x-small' | 'small' | 'medium' | 'large';
};

export const Title = ({ children, white, icon, className, level = 2, size = 'medium' }: TitleProps) => {
  return (
    <Typography.Title
      level={level}
      className={clsx('title', `title--${size}`, white && 'title--white', className)}
    >
      {Boolean(icon) && icon}
      {children}
    </Typography.Title>
  );
};
