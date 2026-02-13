// Ant Design Resources
import { Tooltip } from 'antd';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteMegamix({ track, playersList }: VoteComponentProps) {
  const groupedVotes = useGroupedVotes(playersList);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {groupedVotes.map(([voteValue, voters]) => {
          const optionText = track.data.card.options[Number(voteValue)];
          return (
            <div
              key={`vote-group-${voteValue}`}
              className="vote-groups__group"
            >
              <div className="vote-groups__target">
                <Tooltip title={optionText}>
                  <div className="player-vote__value">{optionText}</div>
                </Tooltip>
              </div>

              <Voters voters={voters} />
            </div>
          );
        })}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
