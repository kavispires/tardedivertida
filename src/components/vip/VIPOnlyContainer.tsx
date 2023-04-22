import clsx from 'clsx';
import { ReactNode } from 'react';
// Ant Design Resources
import { Space, SpaceProps } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
// Hooks
import { useVIP } from 'hooks/useVIP';
// Sass
import './VIPOnlyContainer.scss';

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

export const VIPOnlyContainer = ({ children, label, className = '', ...rest }: VIPOnlyContainerProps) => {
  const isVIP = useVIP();

  if (!isVIP) return <></>;

  return (
    <fieldset className={clsx('vip-only-container', className)}>
      <legend className="vip-only-container__legend">
        <RocketOutlined /> {label ?? 'VIP Controls'}
      </legend>
      <Space {...rest}>{children}</Space>
    </fieldset>
  );
};
