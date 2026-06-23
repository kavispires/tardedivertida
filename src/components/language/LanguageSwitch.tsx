import clsx from 'clsx';
// Ant Design Resources
import { Switch } from 'antd';
// Hooks
import { useGlobalLocalStorage } from '@hooks/useGlobalLocalStorage';
// Components
import { Icon } from '@components/general/Icon';
// Internal
import { BrazilFlag, UnitedStatesFlag } from './LanguageButtons';
// Sass
import styles from './LanguageSwitch.module.scss';

/**
 * Toggle switch component for switching between Portuguese and English languages with flag icons
 */
export function LanguageSwitch() {
  const [language, setLanguage] = useGlobalLocalStorage('language');

  const onSwitchClick = (checked: boolean) => {
    setLanguage(checked ? 'pt' : 'en');
  };

  return (
    <Switch
      checkedChildren={
        <Icon
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
        <Icon
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
