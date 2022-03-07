import { isDevEnv } from '../utils/helpers';
import { useGlobalState } from './index';

/**
 * Runs mock function tht performs whatever
 * @param whatToDo
 * @param [conditions]
 */
export function useDevFeatures() {
  // const [isAdmin] = useGlobalState('isAdmin');
  const [isDebugEnabled, setIsDebugEnabled] = useGlobalState('isDebugEnabled');

  const toggleDevFeatures = () => {
    setIsDebugEnabled((s) => !s);
  };

  return {
    isDevEnv,
    isDebugEnabled,
    toggleDevFeatures,
  };
}
