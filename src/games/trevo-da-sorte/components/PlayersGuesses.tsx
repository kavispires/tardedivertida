import { useState } from 'react';
// Ant Design Resources
import { Tabs } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { sortPlayers } from 'utils/helpers';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Instruction } from 'components/text';
// Internal
import type { CloverObject, Leaves } from '../utils/types';
import { Clover } from './Clover';

type PlayersGuessesProps = {
  players: GamePlayers;
  clover: CloverObject;
  leaves: Leaves;
  rotation: number;
  onRotate: GenericFunction;
  activeCloverId: PlayerId;
};

export function PlayersGuesses({
  players,
  clover,
  leaves,
  rotation,
  onRotate,
  activeCloverId,
}: PlayersGuessesProps) {
  const sortedPlayers = sortPlayers(players).filter((player) => player.id !== activeCloverId);
  const [activePlayerTab, setActivePlayerTab] = useState(`${sortedPlayers[0].id}::tab`);
  const items = sortedPlayers.map((player) => {
    return {
      key: `${player.id}::tab`,
      label: <PlayerAvatarName player={player} />,
      children: (
        <Clover
          mode="result"
          clover={clover}
          leaves={leaves}
          rotation={rotation}
          onRotate={onRotate}
          guesses={player.guesses[activeCloverId]?.leaves ?? {}}
        />
      ),
    };
  });

  return (
    <Instruction contained>
      <Tabs activeKey={activePlayerTab} onChange={(key) => setActivePlayerTab(key)} items={items} />
    </Instruction>
  );
}
