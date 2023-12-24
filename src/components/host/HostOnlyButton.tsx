import { ReactNode } from 'react';
// Ant Design Resources
import { ButtonProps } from 'antd';
// Components
import { HostButton, HostOnlyContainer } from './index';

type VIPOnlyButtonProps = {
  /**
   * The click action
   */
  onClick: GenericFunction;
  /**
   * The button label
   */
  children: ReactNode;
} & ButtonProps;

export function HostOnlyButton({ onClick, children, ...buttonProps }: VIPOnlyButtonProps) {
  return (
    <HostOnlyContainer>
      <HostButton onClick={onClick} {...buttonProps}>
        {children}
      </HostButton>
    </HostOnlyContainer>
  );
}
