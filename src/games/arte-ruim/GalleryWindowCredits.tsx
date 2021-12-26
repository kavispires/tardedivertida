// Components
import { AvatarEntry, Translate } from '../../components';

type GalleryWindowCreditsProps = {
  artistName: string;
  artistAvatarId: string;
};

function GalleryWindowCredits({ artistName, artistAvatarId }: GalleryWindowCreditsProps) {
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

export default GalleryWindowCredits;
