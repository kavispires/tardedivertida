import { useEffect } from 'react';
import { VIEWER_ID } from 'utils/constants';
import { isDevEnv } from 'utils/helpers';
import { useGlobalState } from './useGlobalState';

/**
 * Runs mock function tht performs whatever
 * @param whatToDo
 * @param [conditions]
 */
export function useMock(whatToDo: GenericFunction, conditions: any[] = []) {
  const [isAdmin] = useGlobalState('isAdmin');
  const [userId] = useGlobalState('userId');

  useEffect(() => {
    if (isDevEnv && !isAdmin && userId !== VIEWER_ID) {
      whatToDo();
    }
  }, conditions); // eslint-disable-line
}
