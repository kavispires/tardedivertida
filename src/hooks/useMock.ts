import { useEffect } from 'react';
import { isDevEnv } from 'utils/helpers';
import { useGlobalState } from './useGlobalState';

/**
 * Runs mock function tht performs whatever
 * @param whatToDo
 * @param [conditions]
 */
export function useMock(whatToDo: GenericFunction, conditions: any[] = []) {
  const [isAdmin] = useGlobalState('isAdmin');

  useEffect(() => {
    if (isDevEnv && !isAdmin) {
      whatToDo();
    }
  }, conditions); // eslint-disable-line
}
