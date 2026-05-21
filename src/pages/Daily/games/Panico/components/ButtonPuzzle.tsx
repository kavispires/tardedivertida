import { useEffect, useState } from 'react';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Pages
import { playSFX } from 'pages/Daily/utils/soundEffects';
// Internal
import { validateButtonPress } from '../utils/engine';
import type { ButtonEntry } from '../utils/types';
import { playCountdownSFX, stopCountdownSFX } from '../utils/soundEffect';
import { ButtonContent } from './ButtonContent';
import { CircularTimer } from './CircularTimer';
import { PressButton } from './PressButton';

type ButtonPuzzleProps = {
  /**
   * The unique key identifier of the button from BUTTONS_DICT
   */
  button: ButtonEntry;
  /**
   * Callback function called when the timer expires with validation result
   */
  onComplete: (isCorrect: boolean) => void;
  /**
   * Optional press count from the previous button (for SAME_AS_PREVIOUS buttons)
   */
  previousPressCount?: number;
  /**
   * Width of the puzzle area to size the timer and button accordingly
   */
  size?: number;
};

// Duration mapping for each scale
const DURATION_MAP = {
  quick: 4,
  normal: 6,
  long: 9,
} as const;

/**
 * Container component that manages a single button puzzle with timer and validation
 */
export function ButtonPuzzle({ button, onComplete, previousPressCount, size = 300 }: ButtonPuzzleProps) {
  // Get button configuration
  const config = button ?? null;

  // Get duration and segments based on scale
  const duration = DURATION_MAP[config.durationScale];

  // Handle timer expiration
  const handleExpire = () => {
    stopCountdownSFX();
    const isCorrect = validateButtonPress(
      pressCount,
      config.expectedAction,
      expectedPressCount,
      previousPressCount,
    );
    // playSFX('uh');
    onComplete(isCorrect);
  };

  const { timeLeft } = useCountdown({
    duration,
    autoStart: true,
    onExpire: handleExpire,
  });

  const [pressCount, setPressCount] = useState(0);

  // Play countdown SFX when button starts
  useEffect(() => {
    playCountdownSFX(config.durationScale);
  }, [config.durationScale]);

  if (!config) {
    return null;
  }

  // const segments = SEGMENT_MAP[config.durationScale];

  // Determine the expected press count
  // -2 means use the value from a pool or previous button
  let expectedPressCount = config.targetCount;
  if (config.targetCount === -2) {
    // For now, use previousPressCount if available
    // This will be enhanced when implementing specific button types with pools
    expectedPressCount = previousPressCount ?? 0;
  }

  // Handle button press
  const handlePress = () => {
    playSFX('bubbleIn');

    setPressCount((prev) => prev + 1);

    if (config.verification === 'IMMEDIATE' && timeLeft > 1) {
      setTimeout(() => {
        if (
          validateButtonPress(pressCount + 1, config.expectedAction, expectedPressCount, previousPressCount)
        ) {
          stopCountdownSFX();
          onComplete(true);
        }
      }, 750);
    }
  };

  return (
    <div className="button-puzzle">
      <CircularTimer
        duration={duration}
        timeLeft={timeLeft}
        size={size}
      >
        <PressButton
          onPress={handlePress}
          pressCount={pressCount}
          size={size}
          className={`button-container-variant--${config.buttonVariant}`}
        >
          <ButtonContent
            button={config}
            pressCount={pressCount}
          />
        </PressButton>
      </CircularTimer>
    </div>
  );
}
