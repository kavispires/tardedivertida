// Ant Design Resources
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Switch, Tooltip } from 'antd';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Components
import { Translate } from 'components/language/Translate';
// Sass
import styles from '../PhaseLobby.module.scss';

type SettingsProps = {
  /**
   * Flag indicating if the game contains images that can be blurred
   */
  hasImages: boolean;
};

/**
 * Component that displays lobby settings for volume control and image blur toggle
 */
export function Settings({ hasImages }: SettingsProps) {
  const [blurEnabled, setBlurEnabled] = useGlobalLocalStorage('blurEnabled');
  const [volume, setVolume] = useGlobalLocalStorage('volume');

  const onBlurSwitchClick = (value: boolean) => {
    setBlurEnabled(value);
  };

  const onSoundSwitchClick = (value: boolean) => {
    setVolume(value ? 0.5 : 0);
  };

  return (
    <Space
      className={styles.lobbyStepSettings}
      separator={<Divider orientation="vertical" />}
    >
      <div className={styles.lobbyStepSettingsEntry}>
        <div className={styles.lobbyStepSwitchLabel}>
          <Translate
            pt="Som"
            en="Sound"
          />
          <Tooltip
            title={
              <Translate
                pt="Alguns jogos tocam sons ou falas. Você pode mudar essa configuração durante o jogo."
                en="A few games will play speech. You may change this setting during the game."
              />
            }
          >
            <Button
              type="text"
              shape="circle"
              icon={<InfoCircleOutlined />}
              size="small"
            />
          </Tooltip>
        </div>

        <Switch
          checkedChildren="on"
          unCheckedChildren="off"
          checked={volume > 0}
          onClick={onSoundSwitchClick}
        />
      </div>

      <div className={styles.lobbyStepSettingsEntry}>
        <div className={styles.lobbyStepSwitchLabel}>
          <Translate
            pt="Efeitos"
            en="Effects"
          />
          <Tooltip
            title={
              <Translate
                pt="Alguns jogos tocam efeitos. Você pode mudar essa configuração durante o jogo."
                en="A few games will play sound effects or speech. You may change this setting during the game."
              />
            }
          >
            <Button
              type="text"
              shape="circle"
              icon={<InfoCircleOutlined />}
              size="small"
            />
          </Tooltip>
        </div>

        <Switch
          checkedChildren="on"
          unCheckedChildren="off"
          disabled
        />
      </div>

      <div className={styles.lobbyStepSettingsEntry}>
        <div className={styles.lobbyStepSwitchLabel}>
          <Translate
            pt="Credo"
            en="Blur"
          />
          <Tooltip
            title={
              <Translate
                pt="Adiciona um botão em todas Cartas-imagem para embaça-las caso você tenha alguma fobia. Você pode mudar essa configuração durante o jogo"
                en="Adds a button to every Image Card to blur them in case you are sensitive to their content. You may change this setting during the game"
              />
            }
          >
            <Button
              type="text"
              shape="circle"
              icon={<InfoCircleOutlined />}
              size="small"
            />
          </Tooltip>
        </div>

        <Switch
          checkedChildren="on"
          unCheckedChildren="off"
          checked={blurEnabled}
          onClick={onBlurSwitchClick}
          disabled={!hasImages}
        />
      </div>
    </Space>
  );
}
