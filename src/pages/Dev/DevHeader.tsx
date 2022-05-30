import { PageHeader, PageHeaderProps } from 'antd';
// Components
import { DevMenu } from './DevMenu';

export function DevHeader({ title, extra, ...props }: PageHeaderProps) {
  return (
    <PageHeader
      className="site-page-header"
      title={title}
      ghost={false}
      {...props}
      extra={
        <>
          <DevMenu /> {extra}
        </>
      }
    />
  );
}
