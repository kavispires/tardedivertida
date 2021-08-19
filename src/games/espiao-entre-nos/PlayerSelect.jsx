import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Popconfirm, Select, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState, useLoading } from '../../hooks';

function PlayerSelect({ players, onSend, isFinalAssessment = false }) {
  const [isLoading] = useLoading();
  const [userId] = useGlobalState('userId');

  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const playersWithoutMe = Object.values(players).filter((player) => player.id !== userId);

  return (
    <Space>
      <Select onChange={setSelectedPlayerId} className="e-select" placeholder="Acuse um jogador">
        {playersWithoutMe.map((player) => (
          <Select.Option key={player.id} value={player.id}>
            {player.name}
          </Select.Option>
        ))}
      </Select>
      <Popconfirm
        title={`${
          isFinalAssessment ? '' : 'Você só pode acusar uma vez durante o jogo! '
        }Tem certeza que quer acusar ${players[selectedPlayerId]?.name}?`}
        onConfirm={() => onSend({ vote: selectedPlayerId })}
        okText="Sim"
        cancelText="Não"
      >
        <Button
          type="primary"
          disabled={!selectedPlayerId || isLoading}
          icon={isLoading ? <LoadingOutlined /> : null}
        >
          Acusar{selectedPlayerId ? `: ${players[selectedPlayerId]?.name}` : ''}
        </Button>
      </Popconfirm>
    </Space>
  );
}

PlayerSelect.propTypes = {
  players: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired,
  isFinalAssessment: PropTypes.bool,
};

export default PlayerSelect;
