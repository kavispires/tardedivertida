import clsx from 'clsx';
// Ant Design Resources
import { Space, type SpaceProps } from 'antd';
// Sass
import './SpaceContainer.scss';

type SpaceContainerProps = {
  /**
   * Forces direction to be vertical
   */
  vertical?: boolean;
  /**
   * Adds contained class
   */
  contained?: boolean;
  /**
   * Adds full-width class
   */
  fullWidth?: boolean;
} & SpaceProps;

/**
 * Wrapper for Ant Design Space component where the default is center alignment with (2 0) margins
 */
export function SpaceContainer({
  className,
  align,
  direction,
  children,
  vertical,
  contained,
  fullWidth,
  ...props
}: SpaceContainerProps) {
  return (
    <Space
      className={clsx('space-container', contained && 'contained', fullWidth && 'full-width', className)}
      orientation={vertical ? 'vertical' : direction}
      align={align ?? 'center'}
      {...props}
    >
      {children}
    </Space>
  );
}
