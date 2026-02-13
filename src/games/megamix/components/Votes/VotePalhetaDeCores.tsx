// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SplatterSVG } from '../Tracks/TrackPalhetaDeFores';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VotePalhetaDeCores({ playersList }: VoteComponentProps) {
  const groupedVotes = useGroupedVotes(playersList);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {groupedVotes.map(([color, voters]) => (
          <div
            key={`vote-group-${color}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <SplatterSVG
                color={color}
                style={{ color }}
                width={48}
              />
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
