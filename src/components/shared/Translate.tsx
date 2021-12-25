import PropTypes from 'prop-types';
import React, { ReactElement } from 'react';
// Design Resources
import { message } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';

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
  const language = useLanguage();

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

Translate.propTypes = {
  custom: PropTypes.any,
  en: PropTypes.any.isRequired,
  pt: PropTypes.any.isRequired,
  string: PropTypes.bool,
};

/**
 * Delegate between two strings depending on the active language
 * @param pt
 * @param en
 * @param language
 * @param [custom] text that will override anything else
 * @returns
 */
export function translate(pt: string, en: string, language: Language, custom?: string): string {
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
