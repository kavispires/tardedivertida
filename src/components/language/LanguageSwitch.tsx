import clsx from 'clsx';
// Ant Design Resources
import { Switch } from 'antd';
import { IconAvatar } from 'components/avatars';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLocalStorage } from 'hooks/useLocalStorage';
// Components
import { BrazilFlag, UnitedStatesFlag } from './LanguageButtons';
// Sass
import './LanguageSwitch.scss';

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
      checkedChildren={
        <IconAvatar icon={<BrazilFlag width="1em" height="1em" />} size="small" alt="Português-BR" />
      }
      unCheckedChildren={
        <IconAvatar icon={<UnitedStatesFlag width="1em" height="1em" />} size="small" alt="English-US" />
      }
      checked={language === 'pt'}
      onClick={onSwitchClick}
      className={clsx(language === 'pt' ? 'language-switch-pt' : 'language-switch-en')}
    />
  );
}
