// Types
import type { GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarEntry } from '@components/player/PlayerAvatarEntry';
import { SlideShowLabel } from '@components/slide-show/SlideShowComposableComponents';

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
