import { Layout, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { ReactNode } from 'react';

type HeaderProps = {
  icon: ReactNode;
  children: ReactNode;
};

export function Header({ icon, children }: HeaderProps) {
  return (
    <Layout.Header className="daily-header">
      <IconAvatar icon={icon} />
      <Typography.Title level={1} className="daily-heading">
        {children}
      </Typography.Title>
    </Layout.Header>
  );
}
