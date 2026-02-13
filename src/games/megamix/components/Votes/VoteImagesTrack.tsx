import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteImagesTrack({ playersList }: VoteComponentProps) {
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
        {Object.entries(groupedVotes).map(([cardId, voters]) => (
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
