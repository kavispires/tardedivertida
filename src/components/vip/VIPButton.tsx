import clsx from 'clsx';
// Ant Design Resources
import { RocketOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Sass
import './VIPButton.scss';

/**
 * VIP Button (orange with rocket icon)
 * Important: This button is NOT guarded by VIPOnlyContainer, and it must be wrapped by it.
 */
export function VIPButton({ onClick, icon, disabled, className = '', ...rest }: ButtonProps) {
  const { isLoading } = useLoading();

  return (
    <Button
      icon={icon ?? <RocketOutlined />}
      ghost
      onClick={onClick}
      disabled={disabled || isLoading}
      className={clsx('vip-button', className)}
      {...rest}
    />
  );
}
