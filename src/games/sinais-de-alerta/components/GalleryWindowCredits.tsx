// Types
import type { GamePlayer } from 'types/player';
// Components
import { AvatarEntry } from 'components/avatars';
import { Translate } from 'components/language';

type GalleryWindowCreditsProps = {
  artist: GamePlayer;
};

export function GalleryWindowCredits({ artist }: GalleryWindowCreditsProps) {
  return (
    <div className="sda-gallery__credits">
      <div className="sda-gallery__label">
        <Translate pt="Criador" en="Creator" />
      </div>
      <span className="sda-gallery__artist-name">
        <AvatarEntry player={artist} />
      </span>
    </div>
  );
}
