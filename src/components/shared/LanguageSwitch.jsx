import { Switch } from 'antd';
import React from 'react';
import { useGlobalState, useLocalStorage } from '../../hooks';

export function LanguageSwitch() {
  const [language, setLanguage] = useGlobalState('language');
  const [, setLocalStorage] = useLocalStorage();

  const onSwitchClick = (e) => {
    const value = e ? 'pt' : 'en';
    setLanguage(value);
    setLocalStorage({ language: value });
  };

  return (
    <Switch checkedChildren="pt" unCheckedChildren="en" checked={language === 'pt'} onClick={onSwitchClick} />
  );
}
