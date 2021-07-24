import { useGlobalState } from './index';

/**
 * Returns current selected language
 * @returns {string}
 */
export function useLanguage() {
  const [language] = useGlobalState('language');
  return language;
}
