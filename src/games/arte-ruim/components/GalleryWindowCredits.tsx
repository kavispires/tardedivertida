// Components
import { AvatarEntry } from 'components/avatars';
import { Translate } from 'components/language';

type GalleryWindowCreditsProps = {
  artist: GamePlayer;
};

export function GalleryWindowCredits({ artist }: GalleryWindowCreditsProps) {
  return (
    <div className="a-gallery__credits">
      <div className="a-gallery__label">
        <Translate pt="Artista" en="Artist" />
      </div>
      <span className="a-gallery__artist-name">
        <AvatarEntry player={artist} />
      </span>
    </div>
  );
}
