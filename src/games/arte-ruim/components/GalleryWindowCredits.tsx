// Components
import { AvatarEntry } from 'components/avatars';
import { Translate } from 'components/language';

type GalleryWindowCreditsProps = {
  artistName: string;
  artistAvatarId: string;
};

export function GalleryWindowCredits({ artistName, artistAvatarId }: GalleryWindowCreditsProps) {
  return (
    <div className="a-gallery__credits">
      <div className="a-gallery__label">
        <Translate pt="Artista" en="Artist" />
      </div>
      <span className="a-gallery__artist-name">
        <AvatarEntry id={artistAvatarId} name={artistName} />
      </span>
    </div>
  );
}
