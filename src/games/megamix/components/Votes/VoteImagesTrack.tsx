// Types
import type { VoteComponentProps } from '../../utils/types';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Avatar } from 'components/avatars';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';

export function VoteImagesTrack({ playersList }: VoteComponentProps) {
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
            <ImageCard imageId={player.data.value} cardWidth={width} className="d-table__image-card" />
          </ImageBlurButtonContainer>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
