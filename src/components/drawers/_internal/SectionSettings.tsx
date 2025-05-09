// Ant Design Resources
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Switch, Tooltip } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useDevFeatures } from 'hooks/useDevFeatures';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { LanguageSwitch, Translate } from 'components/language';
// Internal
import { BlurOptions } from './BlurOptions';

export function SectionSettings() {
  const { isAdmin } = useCurrentUserContext();
  const [isAdminEnabled, setIsAdminEnabled] = useGlobalState('isAdminEnabled');
  const { isDebugEnabled, toggleDevFeatures } = useDevFeatures();
  const [blurEnabled, setBlurEnabled] = useGlobalLocalStorage('blurEnabled');
  const [volume, setVolume] = useGlobalLocalStorage('volume');

  const onBlurSwitchClick = (value: boolean) => {
    setBlurEnabled(value);
  };

  const onSoundSwitchClick = (value: boolean) => {
    setVolume(value ? 0.5 : 0);
  };

  return (
    <div className="game-info-drawer__section-settings">
      <div className="game-info-drawer__settings-entry">
        <div className="game-info-drawer__switch-label">
          <Translate pt="Idioma" en="Language" />{' '}
          <Tooltip
            title={
              <Translate
                pt="Mudar língua do aplicativo, as cartas do jogo continuarão em sua língua original"
                en="Change app language, the game cards will remain in its original language"
              />
            }
          >
            <Button type="text" shape="circle" icon={<InfoCircleOutlined />} size="small" />
          </Tooltip>
        </div>

        <LanguageSwitch />
      </div>

      <div className="game-info-drawer__settings-entry">
        <div className="game-info-drawer__switch-label">
          <Translate pt="Som" en="Sound" />
          <Tooltip
            title={<Translate pt="Muda ou desmuda sons no aplicativo" en="Mute/Unmute sounds in the app" />}
          >
            <Button type="text" shape="circle" icon={<InfoCircleOutlined />} size="small" />
          </Tooltip>
        </div>

        <Switch
          checkedChildren="on"
          unCheckedChildren="off"
          checked={volume > 0}
          onClick={onSoundSwitchClick}
        />
      </div>

      <div className="game-info-drawer__settings-entry">
        <div className="game-info-drawer__switch-label">
          <Translate pt="Botão Credo" en="Blur Button" />
          <Tooltip
            title={
              <Translate
                pt="Adiciona um botão em todas Cartas-imagem para embaça-las caso você tenha alguma fobia"
                en="Adds a button to every Image Card to blur them in case you have any phobia"
              />
            }
          >
            <Button type="text" shape="circle" icon={<InfoCircleOutlined />} size="small" />
          </Tooltip>
        </div>

        <Switch
          checkedChildren="on"
          unCheckedChildren="off"
          checked={blurEnabled}
          onClick={onBlurSwitchClick}
        />
      </div>

      {blurEnabled && (
        <div className="game-info-drawer__settings-entry">
          <BlurOptions />
        </div>
      )}

      <div className="game-info-drawer__settings-entry">
        <div className="game-info-drawer__switch-label">
          Debug
          <Tooltip
            title={
              <Translate
                pt="Ativa coisas para ajudar o desenvolvedor a encontrar error. Use apenas quando instruído"
                en="Activate debug mode. Only turn on when instructed"
              />
            }
          >
            <Button type="text" shape="circle" icon={<InfoCircleOutlined />} size="small" />
          </Tooltip>
        </div>

        <Switch
          checkedChildren="on"
          unCheckedChildren="off"
          checked={isDebugEnabled}
          onClick={toggleDevFeatures}
        />
      </div>

      {isAdmin && (
        <div className="game-info-drawer__settings-entry">
          <div className="game-info-drawer__switch-label">
            Admin
            <Tooltip title={<Translate pt="Ativa recursos para o administrador" en="Activate admin mode" />}>
              <Button type="text" shape="circle" icon={<InfoCircleOutlined />} size="small" />
            </Tooltip>
          </div>

          <Switch
            checkedChildren="on"
            unCheckedChildren="off"
            checked={isAdminEnabled}
            onClick={() => setIsAdminEnabled(!isAdminEnabled)}
          />
        </div>
      )}
    </div>
  );
}
