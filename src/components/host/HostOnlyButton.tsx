import type { ReactNode } from 'react';
// Ant Design Resources
import type { ButtonProps } from 'antd';
// Internal
import { HostButton, HostOnlyContainer } from './index';

type HostOnlyButtonProps = {
  /**
   * The click action
   */
  onClick: GenericFunction;
  /**
   * The button label
   */
  children: ReactNode;
} & ButtonProps;

export function HostOnlyButton({ onClick, children, ...buttonProps }: HostOnlyButtonProps) {
  return (
    <HostOnlyContainer>
      <HostButton
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </HostButton>
    </HostOnlyContainer>
  );
}
