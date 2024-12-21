import type { ReactNode } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Internal
import { DevMenu } from './DevMenu';

type DevHeaderProps = {
  title: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
};

export function DevHeader({ title, subTitle, extra }: DevHeaderProps) {
  return (
    <header className="dev-header">
      <div className="dev-header__heading">
        <div className="dev-header__left">
          <span className="dev-header__title">{title} </span>
          <span className="dev-header__subtitle">{subTitle}</span>
        </div>
        <div className="dev-header__extra">
          <Space className="dev-header__extra-space" wrap>
            {extra}
          </Space>
          <DevMenu />
        </div>
      </div>
    </header>
  );
}
