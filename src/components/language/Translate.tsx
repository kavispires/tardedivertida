import { ReactElement } from 'react';
// Ant Design Resources
import { message } from 'antd';
// Hooks
import { useLanguage } from 'hooks';

type LanguageEntry = ReactElement | string;

/**
 * Delegate between two strings depending on the active language
 * @param pt
 * @param en
 * @param [custom] text that will override anything else
 * @returns a fragment
 */
export function Translate({
  pt,
  en,
  custom,
}: {
  pt: LanguageEntry;
  en: LanguageEntry;
  custom?: LanguageEntry;
}): any {
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
