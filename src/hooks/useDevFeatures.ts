import { useEffect } from 'react';
import { isDevEnv } from '../utils/helpers';
import { useGlobalState } from './index';

/**
 * Runs mock function tht performs whatever
 * @param whatToDo
 * @param [conditions]
 */
export function useDevFeatures(whatToDo: GenericFunction, conditions: any[] = []) {
  const [isAdmin] = useGlobalState('isAdmin');
  const [isDevFeaturesEnabled, setIsDevFeaturesEnabled] = useGlobalState('isAdmin');

  const toggleDevFeatures = () => {
    setIsDevFeaturesEnabled((s) => !s);
  };

  return {
    isDevEnv,
    isDevFeaturesEnabled,
    toggleDevFeatures,
  };
}
