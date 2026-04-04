// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { ImageBlurButtonContainer } from 'components/image-cards/ImageBlurButtonContainer';
import { ImageCard } from 'components/image-cards/ImageCard';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteImagesTrack({ playersList }: VoteComponentProps) {
  const width = useCardWidth(playersList.length + 4, {
    gap: 8,
    minWidth: 50,
    maxWidth: 120,
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
              <ImageBlurButtonContainer cardId={cardId}>
                <ImageCard
                  cardId={cardId}
                  cardWidth={width}
                  className="d-table__image-card"
                />
              </ImageBlurButtonContainer>
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
