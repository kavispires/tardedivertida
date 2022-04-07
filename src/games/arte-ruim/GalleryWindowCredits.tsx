// Components
import { AvatarEntry } from 'components/avatars';
import { Translate } from 'components/language';

type GalleryWindowCreditsProps = {
  artistName: string;
  artistAvatarId: string;
};

export function GalleryWindowCredits({ artistName, artistAvatarId }: GalleryWindowCreditsProps) {
  return (
    <div className="a-gallery-window__credits">
      <div className="a-gallery-window__label">
        <Translate pt="Artista" en="Artist" />
      </div>
      <span className="a-gallery-window__artist-name">
        <AvatarEntry id={artistAvatarId} name={artistName} />
      </span>
    </div>
  );
}
