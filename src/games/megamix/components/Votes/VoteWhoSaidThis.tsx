import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Components
import { PlayerAvatarCard } from 'components/player';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteWhoSaidThis({ playersList, players }: VoteComponentProps) {
  const groupedVotes = useMemo(() => {
    return groupBy(playersList, (player) => player.data.value);
  }, [playersList]);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {Object.entries(groupedVotes).map(([votedPlayerId, voters]) => (
          <div
            key={`vote-group-${votedPlayerId}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <PlayerAvatarCard
                player={players[votedPlayerId]}
                withName
                withRoundCorners
                size="small"
              />
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
