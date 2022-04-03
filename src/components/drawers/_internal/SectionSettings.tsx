// Ant Design Resources
import { Button, Switch, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// Hooks
import { useDevFeatures, useGlobalState, useLocalStorage } from 'hooks';
// Components
import { LanguageSwitch, Translate } from 'components/language';

export function SectionSettings() {
  const [blurEnabled, setBlurEnabled] = useGlobalState('blurEnabled');
  const { isDebugEnabled, toggleDevFeatures } = useDevFeatures();
  const [, setLocalStorage] = useLocalStorage();

  const onBlurSwitchClick = (value: boolean) => {
    setBlurEnabled(value);
    setLocalStorage({ blurEnabled: value });
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
    </div>
  );
}
