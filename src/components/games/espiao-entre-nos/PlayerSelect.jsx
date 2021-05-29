import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Popconfirm, Select, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState, useLoading } from '../../../hooks';

function PlayerSelect({ playersList, onSend }) {
  const [isLoading] = useLoading();
  const [username] = useGlobalState('username');

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const playersWithoutMe = playersList.filter((playerName) => playerName !== username);

  return (
    <Space>
      <Select onChange={setSelectedPlayer} className="e-select" placeholder="Acuse um jogador">
        {playersWithoutMe.map((playerName) => (
          <Select.Option key={playerName} value={playerName}>
            {playerName}
          </Select.Option>
        ))}
      </Select>
      <Popconfirm
        title={`Você só pode acusar uma vez durante o jogo! Tem certeza que quer acusar ${selectedPlayer}?`}
        onConfirm={() => onSend({ vote: selectedPlayer })}
        okText="Sim"
        cancelText="Não"
      >
        <Button
          type="primary"
          disabled={!selectedPlayer || isLoading}
          icon={isLoading ? <LoadingOutlined /> : null}
        >
          Acusar{selectedPlayer ? `: ${selectedPlayer}` : ''}
        </Button>
      </Popconfirm>
    </Space>
  );
}

PlayerSelect.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default PlayerSelect;
