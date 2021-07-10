import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Components
import { AvatarEntry } from '../../avatars';

function GalleryWindowCredits({ artistName, artistAvatarId }) {
  return (
    <div className="a-gallery-window__credits">
      <div className="a-gallery-window__label">Artista</div>
      <span className="a-gallery-window__artist-name">
        <AvatarEntry id={artistAvatarId} name={artistName} />
      </span>
    </div>
  );
}

GalleryWindowCredits.propTypes = {
  artistName: PropTypes.string,
  artistAvatarId: PropTypes.string,
};

export default memo(GalleryWindowCredits);
