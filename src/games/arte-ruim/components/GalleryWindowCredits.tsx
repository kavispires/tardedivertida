// Types
import type { GamePlayer } from 'types/player';
// Components
import { AvatarEntry } from 'components/avatars';
import { Translate } from 'components/language';
import { SlideShowLabel } from 'components/slide-show';

type GalleryWindowCreditsProps = {
  artist: GamePlayer;
};

export function GalleryWindowCredits({ artist }: GalleryWindowCreditsProps) {
  return (
    <div className="a-gallery__credits">
      <SlideShowLabel>
        <Translate pt="Artista" en="Artist" />
      </SlideShowLabel>
      <span className="uppercase">
        <AvatarEntry player={artist} />
      </span>
    </div>
  );
}
