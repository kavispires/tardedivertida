import { useGlobalState } from './index';

/**
 * Returns current selected language
 * @returns
 */
export function useLanguage(): Language {
  const [language] = useGlobalState('language');
  return language === 'pt' ? 'pt' : 'en';
}
