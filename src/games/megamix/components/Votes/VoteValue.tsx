import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Tooltip } from 'antd';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteValue({ playersList }: VoteComponentProps) {
  const groupedVotes = useMemo(() => {
    return groupBy(playersList, (player) => player.data.value);
  }, [playersList]);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {Object.entries(groupedVotes).map(([voteValue, voters]) => (
          <div
            key={`vote-group-${voteValue}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <Tooltip title={voteValue}>
                <div className="player-vote__value">{voteValue}</div>
              </Tooltip>
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
