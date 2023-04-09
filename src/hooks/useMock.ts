import { useEffect, useState } from 'react';
// Hooks
import { useCountdown } from './useCountdown';
import { useGlobalState } from './useGlobalState';
// Utils
import { VIEWER_ID } from 'utils/constants';
import { getRandomItem, isDevEnv } from 'utils/helpers';

/**
 * Runs mock function tht performs whatever
 * @param whatToDo
 * @param requirements
 * @param [conditions]
 */
export function useMock(whatToDo: GenericFunction, conditions: any[] = [], requirements: any[] = []) {
  const [isAdmin] = useGlobalState('isAdmin');
  const [userId] = useGlobalState('userId');
  const [runOnce, setRunOnce] = useState(false);

  useEffect(() => {
    if (!runOnce && isDevEnv && !isAdmin && userId !== VIEWER_ID && requirements.every(Boolean)) {
      setRunOnce(true);
      whatToDo();
    }
  }, conditions); // eslint-disable-line
}

/**
 * Runs mock function tht performs whatever after 3 seconds
 * @param whatToDo
 * @param requirements
 * @param delay (default a random value between 3-6 seconds)
 * @returns
 */
export function useDelayedMock(whatToDo: GenericFunction, requirements: any[] = [], delay?: number) {
  const [isAdmin] = useGlobalState('isAdmin');
  const [userId] = useGlobalState('userId');
  const [runOnce, setRunOnce] = useState(false);
  const duration = delay ?? getRandomItem([3, 4, 4, 5, 6]);

  return useCountdown({
    duration,
    onExpire: () => {
      if (!runOnce && isDevEnv && !isAdmin && userId !== VIEWER_ID && requirements.every(Boolean)) {
        whatToDo();
        setRunOnce(true);
      }
    },
    disabled: runOnce,
  });
}
