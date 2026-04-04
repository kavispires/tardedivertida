import type { ReactNode } from 'react';
// Ant Design Resources
import type { ButtonProps } from 'antd';
// Internal
import { HostButton } from './HostButton';
import { HostOnlyContainer } from './HostOnlyContainer';

type HostOnlyButtonProps = {
  /**
   * The click action
   */
  onClick: () => void;
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
