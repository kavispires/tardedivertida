// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';
import { ImageBlurButtonContainer } from 'components/image-cards';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteCharacterTrack({ playersList }: VoteComponentProps) {
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
        {groupedVotes.map(([characterId, voters]) => (
          <div
            key={`vote-group-${characterId}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <ImageBlurButtonContainer cardId={characterId}>
                <CharacterCard
                  size={width}
                  character={{
                    id: characterId,
                    name: { pt: '', en: '' },
                  }}
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
