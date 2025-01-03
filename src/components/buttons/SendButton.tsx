import { debounce } from 'lodash';
import { useCallback } from 'react';
// Ant Design Resources
import { SendOutlined } from '@ant-design/icons';
import { Button, type ButtonProps } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';

type SendButtonProps = ButtonProps & {
  /**
   * Override default 500 ms debounce time
   */
  debounceTime?: number;
};

export function SendButton({
  onClick,
  debounceTime = 500,
  icon,
  loading,
  type = 'primary',
  ...props
}: SendButtonProps) {
  const { isLoading } = useLoading();

  // Use useCallback to memoize the debounced function
  // biome-ignore lint/correctness/useExhaustiveDependencies: without the dependencies, the debounce function memoizes the onClick
  const debouncedClick = useCallback(
    debounce((...args: [React.MouseEvent<HTMLElement>]) => {
      if (onClick) {
        onClick(...args);
      }
    }, debounceTime),
    [onClick, debounceTime],
  );

  // Button click handler
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    debouncedClick(e);
  };

  return (
    <Button
      type={type}
      icon={icon ?? <SendOutlined />}
      onClick={handleClick}
      loading={loading || isLoading}
      {...props}
    />
  );
}
