// Components
import { ItemCard } from '@components/cards/ItemCard';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteComunicacaoAlienigena({ playersList }: VoteComponentProps) {
  const groupedVotes = useGroupedVotes(playersList);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {groupedVotes.map(([itemId, voters]) => (
          <div
            key={`vote-group-${itemId}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <ItemCard
                itemId={String(itemId)}
                width={80}
                className="d-table__image-card"
              />
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
