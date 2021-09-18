import PropTypes from 'prop-types';
import React from 'react';
// Design Resources
import { Button, Switch, Tooltip } from 'antd';
// Hooks
import { useGlobalState, useLocalStorage } from '../../../hooks';
// Components
import { LanguageSwitch, Translate } from '../../shared';
import { InfoCircleOutlined } from '@ant-design/icons';

export function SectionSettings() {
  const [blurEnabled, setBlurEnabled] = useGlobalState('blurEnabled');
  const [, setLocalStorage] = useLocalStorage();

  const onBlurSwitchClick = (value) => {
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
    </div>
  );
}

SectionSettings.propTypes = {
  isTeamGame: PropTypes.bool,
  player: PropTypes.shape({
    avatarId: PropTypes.string,
    name: PropTypes.string,
    score: PropTypes.number,
    team: PropTypes.string,
  }),
};

SectionSettings.defaultProps = {
  isTeamGame: false,
};
