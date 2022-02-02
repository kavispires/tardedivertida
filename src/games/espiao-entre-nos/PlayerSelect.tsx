import { useState } from 'react';
// Design Resources
import { Button, Popconfirm, Select, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState, useLanguage, useLoading } from '../../hooks';
// Components
import { translate, Translate } from '../../components';

type PlayersElectProps = {
  players: GamePlayers;
  onSend: GenericFunction;
  isFinalAssessment?: boolean;
};

export function PlayerSelect({ players, onSend, isFinalAssessment = false }: PlayersElectProps) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [userId] = useGlobalState('userId');

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');

  const playersWithoutMe = Object.values(players).filter((player) => player.id !== userId);

  const onSelectPlayerId = (playerId: PlayerId) => setSelectedPlayerId(playerId);

  return (
    <Space>
      <Select
        onChange={onSelectPlayerId}
        className="e-select"
        placeholder={translate('Acuse um jogador', 'Accuse a player', language)}
      >
        {playersWithoutMe.map((player) => (
          <Select.Option key={player.id} value={player.id}>
            {player.name}
          </Select.Option>
        ))}
      </Select>
      <Popconfirm
        title={`${
          isFinalAssessment
            ? ''
            : translate(
                'Você só pode acusar uma vez durante o jogo! ',
                'You may only make one accusation during the game!',
                language
              )
        } ${translate('Tem certeza que quer acusar', 'Are you sure you want to accuse', language)} ${
          players[selectedPlayerId!]?.name
        }?`}
        onConfirm={() => onSend({ targetId: selectedPlayerId })}
        okText={translate('Sim', 'Yes', language)}
        cancelText={translate('Não', 'No', language)}
      >
        <Button
          type="primary"
          disabled={!selectedPlayerId || isLoading}
          icon={isLoading ? <LoadingOutlined /> : null}
        >
          <Translate pt="Acusar" en="Accuse" />
          {selectedPlayerId ? `: ${players[selectedPlayerId]?.name}` : ''}
        </Button>
      </Popconfirm>
    </Space>
  );
}
