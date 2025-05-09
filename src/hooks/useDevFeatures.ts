// Internal
import { isDevEnv } from '../utils/helpers';
import { useGlobalState } from './useGlobalState';

/**
 * Controls debug and dev environment
 * @returns
 */
export function useDevFeatures() {
  const [isDebugEnabled, setIsDebugEnabled] = useGlobalState('isDebugEnabled');

  const toggleDevFeatures = () => {
    setIsDebugEnabled(!isDebugEnabled);
  };

  return {
    isDevEnv,
    isDebugEnabled,
    toggleDevFeatures,
  };
}
