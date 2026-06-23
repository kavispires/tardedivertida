import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Select, type SelectProps } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatar } from '@components/player/PlayerAvatar';

type PlayersSelectProps = {
  players: GamePlayers;
} & Omit<SelectProps, 'options'>;

/**
 * Select dropdown component with player options sorted alphabetically by name
 */
export function PlayersSelect({ players, style, ...props }: PlayersSelectProps) {
  const options = useMemo(
    () =>
      orderBy(Object.values(players), [(o) => o.name.toLowerCase()], ['asc']).map((player) => ({
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
      })),
    [players],
  );

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
