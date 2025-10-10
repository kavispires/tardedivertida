// Types
import type { GamePlayer } from 'types/player';
// Components
import { PlayerAvatarEntry } from 'components/avatars';
import { Translate } from 'components/language';
import { SlideShowLabel } from 'components/slide-show';

type GalleryWindowCreditsProps = {
  artist: GamePlayer;
};

export function GalleryWindowCredits({ artist }: GalleryWindowCreditsProps) {
  return (
    <div className="sda-gallery__credits">
      <SlideShowLabel>
        <Translate pt="Criador" en="Creator" />
      </SlideShowLabel>
      <span className="uppercase">
        <PlayerAvatarEntry player={artist} />
      </span>
    </div>
  );
}
