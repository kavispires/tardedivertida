import { debounce } from 'lodash';
import { forwardRef, useCallback } from 'react';
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

export const SendButton = forwardRef<HTMLButtonElement, SendButtonProps>(
  ({ onClick, debounceTime = 1500, icon, loading, type = 'primary', ...props }, ref) => {
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
        ref={ref}
        type={type}
        icon={icon ?? <SendOutlined />}
        onClick={handleClick}
        loading={loading || isLoading}
        {...props}
      />
    );
  },
);
