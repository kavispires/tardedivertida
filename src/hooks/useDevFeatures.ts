import { isDevEnv } from '../utils/helpers';
import { useGlobalState } from './index';

/**
 * Controls debug and dev environment
 * @returns
 */
export function useDevFeatures() {
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
