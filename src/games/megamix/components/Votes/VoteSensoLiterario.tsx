// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Components
import { BookPatternCard } from '@components/cards/BookPatternCard';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteSensoLiterario({ playersList }: VoteComponentProps) {
  const width = useCardWidth(playersList.length + 4, {
    gap: 8,
    minWidth: 48,
    maxWidth: 96,
    margin: 8,
  });

  const groupedVotes = useGroupedVotes(playersList);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {groupedVotes.map(([cardId, voters]) => (
          <div
            key={`vote-group-${cardId}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <BookPatternCard
                patternId={cardId}
                cardWidth={width}
              />
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
