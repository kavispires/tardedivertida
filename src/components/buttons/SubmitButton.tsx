import React, { useCallback, useState } from 'react';
import { useDebounce } from 'react-use';
// Ant Design Resources
import { Button, ButtonProps } from 'antd';

type SubmitButtonProps = {
  onClick: () => void;
  debounceDelay?: number;
} & ButtonProps;

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, debounceDelay = 300, ...rest }) => {
  const [isClicked, setIsClicked] = useState(false);

  // Debounced function to handle the click
  const debouncedClick = useCallback(() => {
    onClick();
    setIsClicked(false);
  }, [onClick]);

  // Apply the debounce hook
  useDebounce(debouncedClick, debounceDelay, [isClicked]);

  // Handler for the button click to set the debounce state
  const handleClick = () => {
    setIsClicked(true);
  };

  return <Button onClick={handleClick} {...rest} />;
};
