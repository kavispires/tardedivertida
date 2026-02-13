// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteCruzaPalavras({ track, playersList }: VoteComponentProps) {
  const cheatSheet: PlainObject = {
    0: [track.data.cards[0].text, track.data.cards[2].text],
    1: [track.data.cards[0].text, track.data.cards[3].text],
    2: [track.data.cards[1].text, track.data.cards[2].text],
    3: [track.data.cards[1].text, track.data.cards[3].text],
  };

  const groupedVotes = useGroupedVotes(playersList);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {groupedVotes.map(([voteValue, voters]) => (
          <div
            key={`vote-group-${voteValue}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <div className="track-result-values__text-value">
                {cheatSheet[voteValue][0]} {'+'} {cheatSheet[voteValue][1]}
              </div>
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
