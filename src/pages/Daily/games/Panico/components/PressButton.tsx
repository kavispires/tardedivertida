import type { ReactNode } from 'react';
// Ant Design Resources
import { Button } from 'antd';

type PressButtonProps = {
  /**
   * Callback function when button is pressed
   */
  onPress: () => void;
  /**
   * Content to display inside the button
   */
  children: ReactNode;
  /**
   * Number of times the button has been pressed
   */
  pressCount: number;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
};

/**
 * Round interactive button that tracks press count and provides visual feedback
 */
export function PressButton({ onPress, children, pressCount, disabled = false }: PressButtonProps) {
  return (
    <Button
      shape="circle"
      size="large"
      onClick={onPress}
      disabled={disabled}
      className="press-button"
    >
      <div className="press-button__content">{children}</div>
      {pressCount > 0 && <div className="press-button__count">{pressCount}</div>}
    </Button>
  );
}
