import clsx from 'clsx';
// Ant Design Resources
import { Typography } from 'antd';
import { ReactNode } from 'react';

type TitleProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  white?: boolean;
  icon?: any;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | undefined;
  size?: 'x-small' | 'small' | 'medium' | 'large';
};

export const Title = ({ children, white, icon, className, level = 1, size = 'large' }: TitleProps) => {
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
