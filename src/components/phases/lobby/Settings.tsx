// Ant Design Resources
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Switch, Tooltip } from 'antd';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Components
import { Translate } from 'components/language';
// API & Hooks

type SettingsProps = {
  hasImages: boolean;
};
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
    <Space className="lobby-step__settings" split={<Divider type="vertical" />}>
      <div className="lobby-step__settings-entry">
        <div className="lobby-step__switch-label">
          <Translate pt="Som" en="Sound" />
          <Tooltip
            title={
              <Translate
                pt="Alguns jogos tocam sons ou falas. Você pode mudar essa configuração durante o jogo."
                en="A few games will play sound effects or speech. You may change this setting during the game."
              />
            }
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

      <div className="lobby-step__settings-entry">
        {hasImages && (
          <>
            <div className="lobby-step__switch-label">
              <Translate pt="Botão Credo" en="Blur Button" />
              <Tooltip
                title={
                  <Translate
                    pt="Adiciona um botão em todas Cartas-imagem para embaça-las caso você tenha alguma fobia. Você pode mudar essa configuração durante o jogo"
                    en="Adds a button to every Image Card to blur them in case you have any phobia. You may change this setting during the game"
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
          </>
        )}
      </div>
    </Space>
  );
}
