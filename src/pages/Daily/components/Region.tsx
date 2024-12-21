import clsx from 'clsx';
// Ant Design Resources
import { Space, type SpaceProps } from 'antd';

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
