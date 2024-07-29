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
