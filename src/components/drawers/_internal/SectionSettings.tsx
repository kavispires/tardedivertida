// Ant Design Resources
import { Button, Switch, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// Hooks
import { useDevFeatures } from 'hooks/useDevFeatures';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useCurrentUserContext } from 'services/AuthProvider';
// Components
import { LanguageSwitch, Translate } from 'components/language';
import { BlurOptions } from './BlurOptions';

export function SectionSettings() {
  const [blurEnabled, setBlurEnabled] = useGlobalState('blurEnabled');
  const { isAdmin } = useCurrentUserContext();
  const [isAdminEnabled, setIsAdminEnabled] = useGlobalState('isAdminEnabled');
  const [volume, setVolume] = useGlobalState('volume');
  const { isDebugEnabled, toggleDevFeatures } = useDevFeatures();
  const [, setLocalStorage] = useLocalStorage();

  const onBlurSwitchClick = (value: boolean) => {
    setBlurEnabled(value);
    setLocalStorage({ blurEnabled: value });
  };

  const onSoundSwitchClick = (value: boolean) => {
    setVolume(value ? 0.5 : 0);
    setLocalStorage({ volume: value ? 0.5 : 0 });
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
            onClick={() => setIsAdminEnabled((s) => !s)}
          />
        </div>
      )}
    </div>
  );
}
