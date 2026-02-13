import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Types
import type { CrimesHediondosCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteCrimesHediondos({ playersList, track }: VoteComponentProps) {
  const width = useCardWidth(playersList.length + 4, {
    gap: 8,
    minWidth: 50,
    maxWidth: 120,
    margin: 8,
  });

  const groupedVotes = useMemo(() => {
    return groupBy(playersList, (player) => player.data.value);
  }, [playersList]);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {Object.entries(groupedVotes).map(([cardId, voters]) => {
          const item = track.data.cards.find((card: CrimesHediondosCard) => card.id === cardId);

          if (!item) {
            return null;
          }

          return (
            <div
              key={`vote-group-${cardId}`}
              className="vote-groups__group"
            >
              <div className="vote-groups__target">
                <CrimeItemCard
                  item={item}
                  cardWidth={width}
                  className="d-table__image-card"
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
