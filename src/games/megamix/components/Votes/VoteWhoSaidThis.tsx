// Components
import { PlayerAvatarCard } from 'components/player/PlayerAvatarCard';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteWhoSaidThis({ playersList, players }: VoteComponentProps) {
  const groupedVotes = useGroupedVotes(playersList);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {groupedVotes.map(([votedPlayerId, voters]) => (
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
