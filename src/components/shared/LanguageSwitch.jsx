import { Switch } from 'antd';
import React from 'react';
import { useGlobalState } from '../../hooks';

export function LanguageSwitch() {
  const [language, setLanguage] = useGlobalState('language');
  const onSwitchClick = (e) => setLanguage(e ? 'pt' : 'en');

  return (
    <Switch
      checkedChildren="pt"
      unCheckedChildren="en"
      defaultChecked={language === 'pt'}
      onClick={onSwitchClick}
    />
  );
}
