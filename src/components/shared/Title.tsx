import clsx from 'clsx';
// Design Resources
import { Typography } from 'antd';

type TitleProps = {
  children: any;
  white?: boolean;
  icon?: any;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | undefined;
};

export const Title = ({ children, white, icon, className, level = 1 }: TitleProps) => {
  return (
    <Typography.Title level={level} className={clsx('title', white && 'title--white', className)}>
      {Boolean(icon) && icon}
      {children}
    </Typography.Title>
  );
};

type TitleHighlightProps = {
  children: any;
};

export function TitleHighlight({ children }: TitleHighlightProps) {
  return <span className="title-highlight">{children}</span>;
}
