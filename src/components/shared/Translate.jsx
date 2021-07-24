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
    message.error('Default language not provided');
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
  if (!pt || !en || !language) {
    message.error('Something was not provided');
    return '';
  }

  return language === 'pt' ? pt : en;
}
