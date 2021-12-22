import { useGlobalState } from './index';

/**
 * Returns current selected language
 * @returns
 */
export function useLanguage(): string {
  const [language] = useGlobalState('language');
  return language;
}
