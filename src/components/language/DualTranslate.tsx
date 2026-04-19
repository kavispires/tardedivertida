// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';

type DualTransLateProps = {
  /**
   * The dual language text object
   */
  children: DualLanguageValue | { en: React.ReactNode; pt: React.ReactNode };
};

/**
 * Delegate between two strings depending on the active language
 * @param props
 * @returns the text/element according to the current language
 */
export function DualTranslate({ children }: DualTransLateProps) {
  const { message } = App.useApp();
  const { language } = useLanguage();

  if (!language) {
    const errorMessage = 'Could not reach the useLanguage hook';
    console.error(errorMessage);
    message.error(errorMessage);
    return <span>?</span>;
  }

  return <>{children[language]}</>;
}
