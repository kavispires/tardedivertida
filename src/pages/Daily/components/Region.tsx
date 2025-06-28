import clsx from 'clsx';
// Ant Design Resources
import { Space, type SpaceProps } from 'antd';
// Components
import { SpaceContainer } from 'components/layout/SpaceContainer';

export function Region({ align, direction, children, ...props }: SpaceProps) {
  return (
    <SpaceContainer direction={direction ?? 'vertical'} align={align ?? 'center'} {...props}>
      {children}
    </SpaceContainer>
  );
}

export function TextRegion({ className, align, children, ...props }: SpaceProps) {
  return (
    <Space className={clsx('text-region', className)} align={align ?? 'center'} {...props}>
      {children}
    </Space>
  );
}
