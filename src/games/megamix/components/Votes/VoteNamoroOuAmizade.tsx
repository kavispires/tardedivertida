// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Candidate } from '../Candidate';
import { Voters } from '../Voters';

export function VoteNamoroOuAmizade({ track, playersList }: VoteComponentProps) {
  const groupedVotes = useGroupedVotes(playersList);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {groupedVotes.map(([candidateId, voters]) => {
          const index = track.data.heads.findIndex((head: PlainObject) => head.id === candidateId);

          if (index === -1) {
            return null;
          }

          return (
            <div
              key={`vote-group-${candidateId}`}
              className="vote-groups__group"
            >
              <div className="vote-groups__target">
                <Candidate
                  head={track.data.heads[index]}
                  body={track.data.bodies[index]}
                  interest={track.data.interests[index]}
                  need={track.data.needs[index]}
                  funFact={track.data.funFacts[index]}
                />
              </div>

              <Voters voters={voters} />
            </div>
          );
        })}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
