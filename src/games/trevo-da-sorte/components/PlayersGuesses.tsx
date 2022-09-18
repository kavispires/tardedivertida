import { Tabs } from 'antd';
import { AvatarName } from 'components/avatars';
import { Instruction } from 'components/text';
import { useState } from 'react';
import { sortPlayers } from 'utils/helpers';
import { Clover } from './Clover';

type PlayersGuessesProps = {
  players: GamePlayers;
  clover: Clover;
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

  return (
    <Instruction contained>
      <Tabs activeKey={activePlayerTab} onChange={(key) => setActivePlayerTab(key)}>
        {sortedPlayers.map((player) => {
          return (
            <Tabs.TabPane tab={<AvatarName player={player} />} key={`${player.id}::tab`}>
              <Clover
                mode="result"
                clover={clover}
                leaves={leaves}
                rotation={rotation}
                onRotate={onRotate}
                guesses={player.guesses[activeCloverId]?.leaves ?? {}}
              />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </Instruction>
  );
}
