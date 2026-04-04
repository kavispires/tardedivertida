import clsx from 'clsx';
// Ant Design Resources
import { Switch } from 'antd';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
// Internal
import { BrazilFlag, UnitedStatesFlag } from './LanguageButtons';
// Sass
import styles from './LanguageSwitch.module.scss';

export function LanguageSwitch() {
  const [language, setLanguage] = useGlobalLocalStorage('language');

  const onSwitchClick = (checked: boolean) => {
    setLanguage(checked ? 'pt' : 'en');
  };

  return (
    <Switch
      checkedChildren={
        <IconAvatar
          icon={
            <BrazilFlag
              width="1em"
              height="1em"
            />
          }
          size="small"
          alt="Português-BR"
        />
      }
      unCheckedChildren={
        <IconAvatar
          icon={
            <UnitedStatesFlag
              width="1em"
              height="1em"
            />
          }
          size="small"
          alt="English-US"
        />
      }
      checked={language === 'pt'}
      onClick={onSwitchClick}
      className={clsx(language === 'pt' ? styles.languageSwitchPt : styles.languageSwitchEn)}
    />
  );
}
