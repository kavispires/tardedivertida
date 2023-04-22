import { ReactNode } from 'react';
// Ant Design Resources
import { ButtonProps } from 'antd';
// Components
import { VIPButton, VIPOnlyContainer } from './index';

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

export function VIPOnlyButton({ onClick, children, ...buttonProps }: VIPOnlyButtonProps) {
  return (
    <VIPOnlyContainer>
      <VIPButton onClick={onClick} {...buttonProps}>
        {children}
      </VIPButton>
    </VIPOnlyContainer>
  );
}
