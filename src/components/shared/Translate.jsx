import React from 'react';
// Design Resources
import { message } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';

/**
 * Delegate between two strings depending on the active language
 * @param {*} pt
 * @param {*} en
 * @returns a fragment
 */
export function Translate({ pt, en }) {
  const language = useLanguage();

  if (!language) {
    const errorMessage = 'Could not reach the useLanguage hook';
    console.error(errorMessage);
    message.error(errorMessage);
    return <>?</>;
  }

  if (!pt || !en) {
    const errorMessage = '`pt` or `en` translation was not provided';
    console.error(errorMessage);
    message.error(errorMessage);
    return <>?</>;
  }

  return language === 'pt' ? <>{pt}</> : <>{en}</>;
}

/**
 * Delegate between two strings depending on the active language
 * @param {string} pt
 * @param {string} en
 * @param {string} language
 * @returns {string}
 */
export function translate(pt, en, language) {
  if (!language) {
    const errorMessage = 'Could not reach the language global state';
    console.error(errorMessage);

    return '?';
  }

  if (!pt || !en) {
    const errorMessage = 'PT or EN translation was not provided';
    console.error(errorMessage);

    return '?';
  }

  return language === 'pt' ? pt : en;
}
