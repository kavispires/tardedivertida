import { ReactNode } from 'react';
// Ant Design Resources
import { message } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';

type TransLateProps = {
  pt: ReactNode;
  en: ReactNode;
  custom?: ReactNode;
};

/**
 * Delegate between two strings depending on the active language
 * @param props
 * @returns the text/element according to the current language
 */
export function Translate({ pt, en, custom }: TransLateProps) {
  const { language } = useLanguage();

  if (!language) {
    const errorMessage = 'Could not reach the useLanguage hook';
    console.error(errorMessage);
    message.error(errorMessage);
    return <span>?</span>;
  }

  if (custom) {
    return <span>{custom}</span>;
  }

  if (!pt || !en) {
    const errorMessage = '`pt` or `en` translation was not provided';
    console.error(errorMessage);
    message.error(errorMessage);
    return <span>?</span>;
  }

  return language === 'pt' ? <span>{pt}</span> : <span>{en}</span>;
}
