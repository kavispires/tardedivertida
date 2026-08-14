// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';

type DualTransLateProps = {
  /**
   * The dual language text object
   */
  children: DualLanguageValue<string> | { en: React.ReactNode; pt: React.ReactNode };
};

/**
 * Renders the appropriate text or element based on the current active language (English or Portuguese)
 */
export function DualTranslate({ children }: DualTransLateProps) {
  const { message } = App.useApp();
  const { language } = useLanguage();

  if (!language) {
    const errorMessage = 'Could not reach the useLanguage hook';
    // biome-ignore lint/suspicious/noConsole: for debug purposes
    console.error(errorMessage);
    message.error(errorMessage);
    return <span>?</span>;
  }

  return <>{children[language]}</>;
}
