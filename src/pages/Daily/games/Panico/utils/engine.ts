import { orderBy } from 'lodash';
// Utils
import { SEPARATOR } from 'utils/constants';
// Internal
import type { ButtonEntry } from './types';
import { BUTTONS_LIBRARY, POOLS } from './data';

export function buildButtons(buttons: string[]): ButtonEntry[] {
  const keywords: string[] = [];
  const poolKeywords: string[] = [];

  const buttonEntries: ButtonEntry[] = [];

  buttons.forEach((buttonKey, index) => {
    const [id, buttonType, more] = buttonKey.split(SEPARATOR);

    const buttonData = BUTTONS_LIBRARY[buttonType];

    if (!buttonData) {
      console.warn(`Button type "${buttonType}" not found in BUTTONS_LIBRARY.`);
    }

    const buttonEntry: ButtonEntry = {
      id,
      key: buttonData.key,
      category: buttonData.category,
      targetCount: buttonData.targetCount,
      expectedAction: buttonData.expectedAction,
      durationScale: buttonData.durationScale,
      verification: buttonData.verification,
    };

    if (buttonData.keyword) {
      buttonEntry.keyword = buttonData.keyword;
      keywords.push(buttonData.keyword);
    }

    if (buttonData.dependsOn) {
      buttonEntry.dependsOn = buttonData.dependsOn;
    }

    if (buttonData.eitherOr) {
      buttonEntry.eitherOr = buttonData.eitherOr;
    }

    if (buttonData.buttonVariant) {
      buttonEntry.buttonVariant = buttonData.buttonVariant;
    }

    // Handle pool and appropriate click value
    if (buttonData.pool) {
      const poolIndex = Number(more);
      const index = Number.isNaN(poolIndex) ? 0 : poolIndex;
      const selectedPool = orderBy(Object.values(POOLS[buttonData.pool]), ['id'], ['asc'])[index];

      if (!buttonData.dependsOn && selectedPool?.keyword) {
        poolKeywords.push(selectedPool.keyword);
      }

      // Should update target count and press functions?
      if (![undefined, -2].includes(selectedPool?.targetCount)) {
        buttonEntry.targetCount = selectedPool.targetCount;
        buttonEntry.expectedAction = updateExpectedAction(buttonEntry);
      }

      buttonEntry.pool = selectedPool;
    }

    // RESOLVERS for TBD
    if (buttonData.resolver) {
      switch (buttonData.resolver) {
        case 'PREVIOUS_BUTTON_PRESS_COUNT': {
          const previousButton = buttonEntries[index - 1];
          buttonEntry.targetCount = previousButton?.targetCount ?? 0;
          buttonEntry.expectedAction = previousButton?.expectedAction ?? 'DO_NOT_PRESS';
          buttonEntry.verification = 'IMMEDIATE';
          break;
        }
        case 'POOL_KEYWORD_MATCH':
          if (poolKeywords.includes(buttonEntry.pool?.keyword || '')) {
            buttonEntry.targetCount = 1;
          } else {
            buttonEntry.targetCount = 0;
          }
          buttonEntry.expectedAction = updateExpectedAction(buttonEntry);
          break;
        case 'POOL_KEYWORD_MATCH_REVERSE':
          if (poolKeywords.includes(buttonEntry.pool?.keyword || '')) {
            buttonEntry.targetCount = 0;
          } else {
            buttonEntry.targetCount = 1;
          }
          buttonEntry.expectedAction = updateExpectedAction(buttonEntry);
          break;
        default:
          // Invert the logic if the keyword is present, otherwise leave it as is
          if (keywords.includes(buttonData.resolver || '')) {
            buttonEntry.targetCount = buttonEntry.targetCount === 0 ? 1 : 0;
          } else {
          }
          buttonEntry.expectedAction = updateExpectedAction(buttonEntry);
          break;
      }
    }

    if (buttonEntry.targetCount === -2) {
      console.warn(
        `Pool entry for button "${id}" has an invalid targetCount of -2. Please ensure that the pool entry has a valid targetCount to determine the expected action.`,
        { buttonEntry },
      );
    }

    if (buttonEntry.expectedAction === 'TBD') {
      const errorMessage = `Button with id "${id}" has an expectedAction of "TBD". This requires additional context to determine the correct expected action. Please ensure that the button configuration is updated to specify the expected action or provide necessary context for TBD actions.`;
      console.log(errorMessage, { buttonEntry });
      throw new Error(errorMessage);
    }

    buttonEntries.push(buttonEntry);
  });

  return buttonEntries;
}

function updateExpectedAction(buttonEntry: ButtonEntry) {
  const { targetCount, expectedAction } = buttonEntry;

  if (['PRESS_MORE', 'PRESS_LESS'].includes(expectedAction)) {
    return expectedAction;
  }

  if (targetCount === 0) {
    return 'DO_NOT_PRESS';
  }
  if (targetCount === -1) {
    return 'ANY';
  }
  if (targetCount === 1) {
    return 'PRESS';
  }
  if (targetCount > 1) {
    return 'MULTI_PRESS';
  }
  return 'TBD';
}

/**
 * Validates whether a button was pressed correctly based on its expected action
 * @param actualPressCount - The number of times the button was actually pressed
 * @param expectedAction - The expected action type for the button
 * @param configPressCount - The press count from the button config
 * @param previousPressCount - Optional press count from the previous button (for SAME_AS_PREVIOUS)
 * @returns True if the button was pressed correctly, false otherwise
 */
export function validateButtonPress(
  actualPressCount: number,
  expectedAction: string,
  configPressCount: number,
  previousPressCount?: number,
): boolean {
  switch (expectedAction) {
    case 'PRESS':
      return actualPressCount === configPressCount;

    case 'DO_NOT_PRESS':
      return actualPressCount === 0;

    case 'MULTI_PRESS':
      return actualPressCount === configPressCount;

    case 'PRESS_LESS':
      return actualPressCount < configPressCount;

    case 'PRESS_MORE':
      return actualPressCount > configPressCount;

    case 'ANY':
      return true;

    case 'TBD':
      // For TBD actions, check if it's SAME_AS_PREVIOUS logic
      if (configPressCount === -2 && previousPressCount !== undefined) {
        return actualPressCount === previousPressCount;
      }
      // Default to true for other TBD cases
      return true;

    default:
      // Unknown action type, default to false for safety
      return false;
  }
}
