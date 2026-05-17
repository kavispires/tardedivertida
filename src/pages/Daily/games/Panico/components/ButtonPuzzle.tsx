import { useState } from 'react';
// Internal
import { BUTTONS_DICT } from '../utils/data';
import { validateButtonPress } from '../utils/helpers';
import { ButtonContent } from './ButtonContent';
import { CircularTimer } from './CircularTimer';
import { PressButton } from './PressButton';

type ButtonPuzzleProps = {
  /**
   * The unique key identifier of the button from BUTTONS_DICT
   */
  buttonKey: string;
  /**
   * Callback function called when the timer expires with validation result
   */
  onComplete: (isCorrect: boolean) => void;
  /**
   * Optional press count from the previous button (for SAME_AS_PREVIOUS buttons)
   */
  previousPressCount?: number;
};

// Duration mapping for each scale
const DURATION_MAP = {
  quick: 4,
  normal: 7,
  long: 10,
} as const;

// Segment calculation: 2x duration
const SEGMENT_MAP = {
  quick: 8,
  normal: 14,
  long: 20,
} as const;

/**
 * Container component that manages a single button puzzle with timer and validation
 */
export function ButtonPuzzle({ buttonKey, onComplete, previousPressCount }: ButtonPuzzleProps) {
  const [pressCount, setPressCount] = useState(0);

  // Get button configuration
  const config = BUTTONS_DICT[buttonKey];

  if (!config) {
    return null;
  }

  // Get duration and segments based on scale
  const duration = DURATION_MAP[config.durationScale];
  const segments = SEGMENT_MAP[config.durationScale];

  // Determine the expected press count
  // -2 means use the value from a pool or previous button
  let expectedPressCount = config.pressCount;
  if (config.pressCount === -2) {
    // For now, use previousPressCount if available
    // This will be enhanced when implementing specific button types with pools
    expectedPressCount = previousPressCount ?? 0;
  }

  // Handle button press
  const handlePress = () => {
    setPressCount((prev) => prev + 1);
  };

  // Handle timer expiration
  const handleExpire = () => {
    const isCorrect = validateButtonPress(
      pressCount,
      config.expectedAction,
      expectedPressCount,
      previousPressCount,
    );
    onComplete(isCorrect);
  };

  return (
    <div className="button-puzzle">
      {/* Circular timer wraps around the button */}
      <CircularTimer
        duration={duration}
        segments={segments}
        onExpire={handleExpire}
      />

      {/* Pressable button in the center */}
      <PressButton
        onPress={handlePress}
        pressCount={pressCount}
      >
        <ButtonContent
          buttonKey={buttonKey}
          config={config}
        />
      </PressButton>
    </div>
  );
}
