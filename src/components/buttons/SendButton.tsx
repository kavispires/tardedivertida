import { throttle } from 'lodash';
import { forwardRef, useCallback } from 'react';
// Ant Design Resources
import { SendOutlined } from '@ant-design/icons';
import { Button, type ButtonProps } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';

type SendButtonProps = ButtonProps & {
  /**
   * Override default 1500 ms throttle time
   */
  throttleTime?: number;
};

export const SendButton = forwardRef<HTMLButtonElement, SendButtonProps>(
  ({ onClick, throttleTime = 1500, icon, loading, type = 'primary', ...props }, ref) => {
    const { isLoading } = useLoading();

    // Use useCallback to memoize the throttled function
    // biome-ignore lint/correctness/useExhaustiveDependencies: without the dependencies, the throttle function memoizes the onClick
    const throttledClick = useCallback(
      throttle((...args: [React.MouseEvent<HTMLElement>]) => {
        if (onClick) {
          onClick(...args);
        }
      }, throttleTime),
      [onClick, throttleTime],
    );

    // Button click handler
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      throttledClick(e);
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
