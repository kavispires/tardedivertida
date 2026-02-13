import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteQuemNaoMata({ players, playersList }: VoteComponentProps) {
  const groupedVotes = useMemo(() => {
    return groupBy(playersList, (player) => player.data.value);
  }, [playersList]);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {Object.entries(groupedVotes).map(([playerId, voters]) => (
          <div
            key={`vote-group-${playerId}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <div className="player-vote__value">{players[playerId]?.name}</div>
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
