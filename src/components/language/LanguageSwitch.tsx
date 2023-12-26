// Ant Design Resources
import { Switch } from 'antd';
import { IconAvatar } from 'components/avatars';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { BrazilFlag, UnitedStatesFlag } from './LanguageButtons';

export function LanguageSwitch() {
  const [language, setLanguage] = useGlobalState('language');
  const [, setLocalStorage] = useLocalStorage();

  const onSwitchClick = (e: any) => {
    const value = e ? 'pt' : 'en';
    setLanguage(value);
    setLocalStorage({ language: value });
  };

  return (
    <Switch
      checkedChildren={<IconAvatar icon={<BrazilFlag />} size="small" />}
      unCheckedChildren={<IconAvatar icon={<UnitedStatesFlag />} size="small" />}
      checked={language === 'pt'}
      onClick={onSwitchClick}
    />
  );
}
