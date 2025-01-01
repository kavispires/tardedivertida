import clsx from 'clsx';
// Ant Design Resources
import { Space, type SpaceProps } from 'antd';
// Sass
import './SpaceContainer.scss';

/**
 * Wrapper for Ant Design Space component where the default is center alignment with (2 0) margins
 */
export function SpaceContainer({ className, align, direction, children, ...props }: SpaceProps) {
  return (
    <Space
      className={clsx('space-container', className)}
      direction={direction}
      align={align ?? 'center'}
      {...props}
    >
      {children}
    </Space>
  );
}
