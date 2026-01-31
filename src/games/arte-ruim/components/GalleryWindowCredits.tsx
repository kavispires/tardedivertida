// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
import { PlayerAvatarEntry } from 'components/player';
import { SlideShowLabel } from 'components/slide-show';

type GalleryWindowCreditsProps = {
  artist: GamePlayer;
};

export function GalleryWindowCredits({ artist }: GalleryWindowCreditsProps) {
  return (
    <div className="a-gallery__credits">
      <SlideShowLabel>
        <Translate
          pt="Artista"
          en="Artist"
        />
      </SlideShowLabel>
      <span className="uppercase">
        <PlayerAvatarEntry player={artist} />
      </span>
    </div>
  );
}
