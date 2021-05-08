import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Components
import AvatarEntry from '../avatars/AvatarEntry';

function GalleryWindowCredits({ artist, artistAvatarId }) {
  return (
    <div className="a-gallery-window__credits">
      <div className="a-gallery-window__label">Artista</div>
      <span className="a-gallery-window__artist-name">
        <AvatarEntry id={artistAvatarId} name={artist} />
      </span>
    </div>
  );
}

GalleryWindowCredits.propTypes = {
  artist: PropTypes.string,
  artistAvatarId: PropTypes.number,
};

export default memo(GalleryWindowCredits);
