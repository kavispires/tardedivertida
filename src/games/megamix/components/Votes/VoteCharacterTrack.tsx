// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Avatar } from 'components/avatars';
import { ImageBlurButtonContainer } from 'components/image-cards';
import { CharacterCard } from 'components/cards/CharacterCard';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteCharacterTrack({ playersList }: VoteComponentProps) {
  const width = useCardWidth(playersList.length + 4, {
    gap: 8,
    minWidth: 50,
    maxWidth: 120,
    margin: 8,
  });

  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>
          <ImageBlurButtonContainer cardId={player.data.value}>
            <CharacterCard
              size={width}
              character={{
                id: player.data.value,
                name: { pt: '', en: '' },
              }}
            />
          </ImageBlurButtonContainer>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
