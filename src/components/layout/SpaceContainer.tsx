import clsx from 'clsx';
// Ant Design Resources
import { Space, type SpaceProps } from 'antd';
// Sass
import styles from './SpaceContainer.module.scss';

type SpaceContainerProps = {
  /**
   * Forces orientation to be vertical
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
  orientation,
  children,
  vertical,
  contained,
  fullWidth,
  ...props
}: SpaceContainerProps) {
  return (
    <Space
      className={clsx(styles.spaceContainer, contained && 'contained', fullWidth && 'full-width', className)}
      orientation={vertical ? 'vertical' : orientation}
      align={align ?? 'center'}
      {...props}
    >
      {children}
    </Space>
  );
}
