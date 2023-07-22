import { useState } from 'react';
// Hooks
import { useCountdown } from './useCountdown';
import { useGlobalState } from './useGlobalState';
import { useVIP } from './useVIP';
// Utils
import { VIEWER_ID } from 'utils/constants';
import { getRandomItem, isDevEnv } from 'utils/helpers';
import { USE_MOCKS } from 'dev-configs';

/**
 * Runs mock function tht performs whatever after 3-6 seconds
 * @param whatToDo
 * @param requirements
 * @param delay (default a random value between 3-6 seconds)
 * @returns
 */
export function useMock(whatToDo: GenericFunction, requirements: any[] = [], delay?: number) {
  const isVIP = useVIP();
  const [userId] = useGlobalState('userId');
  const [runOnce, setRunOnce] = useState(false);
  const duration = delay ?? getRandomItem([3, 4, 4, 5, 6]);

  return useCountdown({
    duration,
    onExpire: () => {
      if (
        !runOnce &&
        isDevEnv &&
        USE_MOCKS &&
        !isVIP &&
        userId !== VIEWER_ID &&
        requirements.every(Boolean)
      ) {
        whatToDo();
        setRunOnce(true);
      }
    },
    disabled: runOnce,
  });
}
