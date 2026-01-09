import { orderBy } from 'lodash';
// Ant Design Resources
import { Select, type SelectProps } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { PlayerAvatar } from 'components/avatars';
import { Translate } from 'components/language';

type PlayersSelectProps = {
  players: GamePlayers;
} & Omit<SelectProps, 'options'>;

export function PlayersSelect({ players, style, ...props }: PlayersSelectProps) {
  const options = orderBy(Object.values(players), [(o) => o.name.toLowerCase()], ['asc']).map((player) => ({
    key: player.id,
    value: player.id,
    label: (
      <>
        <PlayerAvatar
          avatarId={player.avatarId}
          size="small"
        />{' '}
        {player.name}
      </>
    ),
    // label: player.name,
  }));

  return (
    <Select
      options={options}
      style={{ minWidth: 128, ...style }}
      placeholder={
        <Translate
          en="Select a player"
          pt="Selecione um jogador"
        />
      }
      {...props}
    />
  );
}
