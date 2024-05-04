import { useGlobalState } from './useGlobalState';

export type UseLanguageResult = {
  language: Language;
  translate: (pt: string, en: string, custom?: string) => string;
  dualTranslate: (dualLanguageObj: DualLanguageValue) => string;
  setLanguage: (u: React.SetStateAction<Language>) => void;
  toggleLanguage: () => void;
};

/**
 * Translate text
 * @returns
 */
export function useLanguage(): UseLanguageResult {
  const [language, setLanguage] = useGlobalState('language');

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
