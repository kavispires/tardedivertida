import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { Space, SpaceProps } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
// Hooks
import { useHost } from 'hooks/useHost';
// Sass
import './HostOnlyContainer.scss';

interface VIPOnlyContainerProps extends SpaceProps {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Custom label
   */
  label?: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
}

export const HostOnlyContainer = ({ children, label, className = '', ...rest }: VIPOnlyContainerProps) => {
  const isHost = useHost();

  if (!isHost) return <></>;

  return (
    <fieldset className={clsx('host-only-container', className)}>
      <legend className="host-only-container__legend">
        <RocketOutlined /> {label ?? 'Host Controls'}
      </legend>
      <Space {...rest}>{children}</Space>
    </fieldset>
  );
};
