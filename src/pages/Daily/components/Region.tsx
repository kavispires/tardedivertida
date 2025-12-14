import clsx from 'clsx';
// Ant Design Resources
import { BulbOutlined } from '@ant-design/icons';
import { Flex, Typography, type SpaceProps } from 'antd';
// Components
import { SpaceContainer } from 'components/layout/SpaceContainer';

export function Region({ align, direction, children, className, ...props }: SpaceProps) {
  return (
    <SpaceContainer
      orientation={direction ?? 'vertical'}
      align={align ?? 'center'}
      className={clsx('region', className)}
      {...props}
    >
      {children}
    </SpaceContainer>
  );
}

export function RegionText({ align, children, className, ...props }: SpaceProps) {
  return (
    <SpaceContainer align={align ?? 'center'} className={clsx('region', className)} {...props}>
      <Typography.Text strong className="region-text">
        {children}
      </Typography.Text>
    </SpaceContainer>
  );
}

export function RegionHint({ align, children, className, ...props }: SpaceProps) {
  return (
    <SpaceContainer align={align ?? 'center'} className={clsx('region', className)} {...props}>
      <Flex className="region-hint" gap={6}>
        <BulbOutlined />
        <span>{children}</span>
      </Flex>
    </SpaceContainer>
  );
}
