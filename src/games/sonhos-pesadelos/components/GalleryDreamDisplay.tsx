// Types
import type { GamePlayer } from 'types/player';
import type { GalleryEntry } from '../utils/types';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { AvatarName } from 'components/avatars';
import { ImageCard } from 'components/image-cards';

type GalleryDreamDisplayProps = {
  entry: GalleryEntry;
  activePlayer: GamePlayer;
};

export function GalleryDreamDisplay({ entry, activePlayer }: GalleryDreamDisplayProps) {
  const cardWidth = useCardWidth(5, { gap: 40 });
  return (
    <div className="s-gallery-dream-display">
      <div className="s-gallery-dream-display__player">
        <AvatarName player={activePlayer} />
      </div>
      <div className="s-gallery-dream-display__theme-container">
        <div className="s-gallery-dream-display__theme">{activePlayer.theme.text}:</div>
        <div className="s-gallery-dream-display__dream">{entry.dream}</div>
      </div>
      <div className="s-gallery-dream-display__dream-image-container">
        <ImageCard
          id={entry.dreamId}
          cardWidth={cardWidth}
          className="s-gallery-dream-display__dream-image"
        />
      </div>
    </div>
  );
}
