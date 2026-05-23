import { useState } from 'react';
import { useMeasure } from 'react-use';
// Ant Design Resources
import { Button } from 'antd';
// Icons
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
import { CrownIcon, SkullIcon } from 'icons/collection';
// Components
import { Translate } from 'components/language/Translate';
// Pages
import { playSFX } from 'pages/Daily/utils/soundEffects';
// Internal
import type { ButtonEntry } from '../utils/types';
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
   * If the game can't be played anymore (either win or lose)
   */
  isComplete: boolean;
  /**
   * If the player won the game
   */
  isWin: boolean;
  /**
   * Array of button keys to display
   */
  buttons: ButtonEntry[];
  /**
   * Callback when a button is completed (validated)
   */
  onNextButton: (isCorrect: boolean) => void;
  /**
   * Callback to start the game
   */
  onStart: () => void;
};

export function Panel({
  activeButtonIndex,
  sessionStatus,
  buttons,
  onNextButton,
  onStart,
  isComplete,
  isWin,
}: PanelProps) {
  const [previousPressCount, setPreviousPressCount] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const handleStart = () => {
    playSFX('select');
    // Show processing state
    setIsProcessing(true);

    // Wait 2 seconds before proceeding to next button
    setTimeout(() => {
      setPreviousPressCount(undefined);

      if (!isComplete) {
        onStart();
      }
      setIsProcessing(false);
    }, 2000);
  };

  // Handle button completion
  const handleComplete = (isCorrect: boolean) => {
    // Show processing state
    setIsProcessing(true);

    // Wait 2 seconds before proceeding to next button
    setTimeout(() => {
      if (isCorrect) {
        // Store the press count for next button if needed
        setPreviousPressCount(undefined);
      }
      setIsProcessing(false);
      onNextButton(isCorrect);
    }, 1000);
  };

  // Processing state - show animated icon between buttons
  if (isProcessing) {
    return (
      <div className="panico-panel panico-panel--processing">
        <AnimatedProcessingIcon className="panico-panel__processing-icon" />
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="panico-panel panico-panel--finished">
        <span>
          {isWin ? (
            <CrownIcon
              className="button-item-sprite"
              width={64}
            />
          ) : (
            <SkullIcon
              className="button-item-sprite"
              width={64}
            />
          )}
        </span>
      </div>
    );
  }

  // Idle state - show start button
  if (sessionStatus === 'idle') {
    return (
      <div className="panico-panel panico-panel--idle">
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={handleStart}
        >
          <Translate
            en="Start"
            pt="Iniciar"
          />
        </Button>
      </div>
    );
  }

  // Ongoing state - show active button puzzle
  const activeButtonKey = buttons[activeButtonIndex];

  if (!activeButtonKey) {
    return (
      <div className="panico-panel">
        <div>
          <Translate
            en="No more buttons!"
            pt="Não há mais botões!"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="panico-panel"
      ref={ref}
    >
      <ButtonPuzzle
        button={buttons[activeButtonIndex]}
        onComplete={handleComplete}
        previousPressCount={previousPressCount}
        size={width}
        buttonIndex={activeButtonIndex}
      />
    </div>
  );
}
