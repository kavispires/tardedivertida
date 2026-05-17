import { useState } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Icons
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
// Components
import { Translate } from 'components/language/Translate';
// Internal
import { ButtonPuzzle } from './ButtonPuzzle';

type PanelProps = {
  /**
   * Current active button index in the sequence
   */
  activeButtonIndex: number;
  /**
   * Session status (idle or ongoing)
   */
  sessionStatus: 'idle' | 'ongoing';
  /**
   * Array of button keys to display
   */
  buttons: string[];
  /**
   * Callback when a button is completed (validated)
   */
  onNextButton: (isCorrect: boolean) => void;
  /**
   * Callback to start the game
   */
  onStart: () => void;
};

export function Panel({ activeButtonIndex, sessionStatus, buttons, onNextButton, onStart }: PanelProps) {
  const [previousPressCount, setPreviousPressCount] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle button completion
  const handleComplete = (isCorrect: boolean) => {
    // Show processing state
    setIsProcessing(true);

    // Wait 2 seconds before proceeding to next button
    setTimeout(() => {
      if (isCorrect) {
        // Store the press count for next button if needed
        // TODO: Track actual press count for SAME_AS_PREVIOUS buttons
        setPreviousPressCount(undefined);
      }
      setIsProcessing(false);
      onNextButton(isCorrect);
    }, 2000);
  };

  // Idle state - show start button
  if (sessionStatus === 'idle') {
    return (
      <div className="panico-panel panico-panel--idle">
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={onStart}
        >
          <Translate
            en="Start"
            pt="Iniciar"
          />
        </Button>
      </div>
    );
  }

  // Processing state - show animated icon between buttons
  if (isProcessing) {
    return (
      <div className="panico-panel panico-panel--processing">
        <AnimatedProcessingIcon className="panico-panel__processing-icon" />
      </div>
    );
  }

  // Ongoing state - show active button puzzle
  const activeButtonKey = buttons[activeButtonIndex];

  if (!activeButtonKey) {
    return (
      <div className="panico-panel">
        <div>No button available</div>
      </div>
    );
  }

  // Extract the button type from the ID (format: "id::BUTTON_TYPE")
  const buttonType = activeButtonKey.includes('::') ? activeButtonKey.split('::')[1] : activeButtonKey;

  return (
    <div className="panico-panel panico-panel--active">
      <ButtonPuzzle
        buttonKey={buttonType} // Changed from activeButtonKey to buttonType
        onComplete={handleComplete}
        previousPressCount={previousPressCount}
      />
    </div>
  );
}
