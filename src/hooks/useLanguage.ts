// Internal
import { useGlobalLocalStorage } from './useGlobalLocalStorage';

export type UseLanguageResult = {
  language: Language;
  translate: (pt: string, en: string, custom?: string) => string;
  dualTranslate: (dualLanguageObj: DualLanguageValue) => string;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

/**
 * Translate text
 * @returns
 */
export function useLanguage(): UseLanguageResult {
  const [language, setLanguage] = useGlobalLocalStorage('language');

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  function translate(pt: string, en: string, custom?: string): string {
    if (!language) {
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error('Could not reach the language global state');

      return '?';
    }

    if (custom) {
      return custom;
    }

    if (!pt || !en) {
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error('PT or EN translation was not provided');

      return '?';
    }

    return language === 'pt' ? pt : en;
  }

  function dualTranslate(dualLanguageObj: DualLanguageValue) {
    return dualLanguageObj[language];
  }

  return {
    language: language === 'pt' ? 'pt' : 'en',
    translate,
    dualTranslate,
    setLanguage,
    toggleLanguage,
  };
}
