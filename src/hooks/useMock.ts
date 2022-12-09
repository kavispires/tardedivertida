import { useEffect, useState } from 'react';
import { VIEWER_ID } from 'utils/constants';
import { isDevEnv } from 'utils/helpers';
import { useGlobalState } from './useGlobalState';

/**
 * Runs mock function tht performs whatever
 * @param whatToDo
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
