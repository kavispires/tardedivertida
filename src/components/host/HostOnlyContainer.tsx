import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { RocketOutlined } from '@ant-design/icons';
import { Space, SpaceProps } from 'antd';
// Hooks
import { useHost } from 'hooks/useHost';
// Sass
import './HostOnlyContainer.scss';

interface HostOnlyContainerProps extends SpaceProps {
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

export const HostOnlyContainer = ({ children, label, className = '', ...rest }: HostOnlyContainerProps) => {
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
