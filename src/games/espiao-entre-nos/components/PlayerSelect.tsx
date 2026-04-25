import { useState } from 'react';
// Ant Design Resources
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { Popconfirm } from 'components/general/Popconfirm';
import { Translate } from 'components/language/Translate';

type PlayersElectProps = {
  players: GamePlayers;
  onSend: GenericFunction;
  isFinalAssessment?: boolean;
};

export function PlayerSelect({ players, onSend, isFinalAssessment = false }: PlayersElectProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [userId] = useGlobalState('userId');

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');

  const playersWithoutMe = Object.values(players).filter((player) => player.id !== userId);

  const onSelectPlayerId = (playerId: UID) => setSelectedPlayerId(playerId);

  return (
    <Space>
      <Select
        onChange={onSelectPlayerId}
        className="e-select"
        placeholder={translate('Acuse um jogador', 'Accuse a player')}
        options={playersWithoutMe.map((player) => ({
          key: player.id,
          value: player.id,
          label: player.name,
        }))}
      />
      <Popconfirm
        title={`${
          isFinalAssessment
            ? ''
            : translate(
                'Você só pode acusar uma vez durante o jogo!',
                'You may only make one accusation during the game!',
              )
        } ${translate('Tem certeza que quer acusar', 'Are you sure you want to accuse')} ${
          players[selectedPlayerId]?.name
        }?`}
        onConfirm={() => onSend({ targetId: selectedPlayerId })}
        type="yes-no"
      >
        <Button
          type="primary"
          disabled={!selectedPlayerId || isLoading}
          icon={isLoading ? <LoadingOutlined /> : null}
        >
          <Translate
            pt="Acusar"
            en="Accuse"
          />
          {selectedPlayerId ? `: ${players[selectedPlayerId]?.name}` : ''}
        </Button>
      </Popconfirm>
    </Space>
  );
}
