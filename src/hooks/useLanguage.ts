// Internal
import { useGlobalLocalStorage } from './useGlobalLocalStorage';

export type UseLanguageResult = {
  /**
   * Current language state, either 'pt' for Portuguese or 'en' for English
   */
  language: Language;
  /**
   * Translates text based on the current language setting
   * @param params Object containing Portuguese (pt), English (en), and optional custom translation
   * @returns Translated string based on the current language or custom text if provided
   */
  translate: (params: { pt: string; en: string; custom?: string }) => string;
  /**
   * Sets the current language state
   * @param language Language code to set ('pt' or 'en')
   */
  setLanguage: (language: Language) => void;
  /**
   * Toggles between Portuguese and English languages
   */
  toggleLanguage: () => void;
};

/**
 * Hook that provides language management and translation utilities
 * Manages the current language state (Portuguese or English) and provides functions to translate text
 */
export function useLanguage(): UseLanguageResult {
  const [language, setLanguage] = useGlobalLocalStorage('language');

  /**
   * Toggles between Portuguese and English languages
   */
  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  /**
   * Translates text based on the current language setting
   * Returns the Portuguese text if language is 'pt', English text if 'en', or custom text if provided
   * Falls back to '?' if language state is unavailable or required translations are missing
   */
  function translate(params: { pt: string; en: string; custom?: string }): string {
    const { pt, en, custom } = params;

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
      console.error(`PT or EN translation was not provided: ${JSON.stringify(params)}`);

      return '?';
    }

    return language === 'pt' ? pt : en;
  }

  return {
    language: language === 'pt' ? 'pt' : 'en',
    translate,
    setLanguage,
    toggleLanguage,
  };
}
