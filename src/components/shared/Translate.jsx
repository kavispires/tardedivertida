import React from 'react';
// Design Resources
import { message } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';

/**
 * Delegate between two strings depending on the active language
 * @param {*} pt
 * @param {*} en
 * @param {*} [custom] text that will override anything else
 * @returns a fragment
 */
export function Translate({ pt, en, custom = null, string = false }) {
  const language = useLanguage();

  if (string) return translate(pt, en, language, custom);

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

/**
 * Delegate between two strings depending on the active language
 * @param {string} pt
 * @param {string} en
 * @param {string} language
 * @param {*} [custom] text that will override anything else
 * @returns {string}
 */
export function translate(pt, en, language, custom = null) {
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
