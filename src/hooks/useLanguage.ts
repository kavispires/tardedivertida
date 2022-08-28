import { useGlobalState } from './useGlobalState';

/**
 * Translate text
 * @returns
 */
export function useLanguage(): {
  language: Language;
  translate: (pt: string, en: string, custom?: string) => string;
} {
  const [language] = useGlobalState('language');

  function translate(pt: string, en: string, custom?: string): string {
    if (!language) {
      const errorMessage = 'Could not reach the language global state';
      console.error(errorMessage);

      return '?';
    }

    if (custom) {
      return custom;
    }

    if (!pt || !en) {
      const errorMessage = 'PT or EN translation was not provided';
      console.error(errorMessage);

      return '?';
    }

    return language === 'pt' ? pt : en;
  }

  return {
    language: language === 'pt' ? 'pt' : 'en',
    translate,
  };
}
