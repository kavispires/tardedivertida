import { Space, SpaceProps } from 'antd';
import clsx from 'clsx';

export function Region({ className, align, direction, children, ...props }: SpaceProps) {
  return (
    <Space
      className={clsx('space-container', className)}
      direction={direction ?? 'vertical'}
      align={align ?? 'center'}
      {...props}
    >
      {children}
    </Space>
  );
}

export function TextRegion({ className, align, children, ...props }: SpaceProps) {
  return (
    <Space className={clsx('text-region', className)} align={align ?? 'center'} {...props}>
      {children}
    </Space>
  );
}
