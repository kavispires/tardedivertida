// Helpers
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';

import { Page } from './Page';

type AlbumProps = {
  albumEntry: LAlbumEntry;
  currentPage: number;
  players: GamePlayers;
};

export function Album({ albumEntry, currentPage, players }: AlbumProps) {
  const albumOwner = players[albumEntry.id];
  const albumColor = getAvatarColorById(albumOwner.avatarId);

  return (
    <div className="l-album">
      <h2 className="l-album__owner" style={{ backgroundColor: albumColor }}>
        <Avatar id={albumOwner.avatarId} size="large" />{' '}
        <Translate pt={<>Álbum de {albumOwner.name}</>} en={<>{albumOwner.name}'s Album</>} />
      </h2>

      <Page
        slide={albumEntry.slides[currentPage]}
        players={players}
        albumColor={albumColor}
        currentPage={currentPage}
        totalSlides={albumEntry.slides.length}
      />
    </div>
  );
}
