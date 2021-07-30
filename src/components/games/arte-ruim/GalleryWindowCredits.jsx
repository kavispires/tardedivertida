import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Components
import { AvatarEntry } from '../../avatars';
import { Translate } from '../../shared';

function GalleryWindowCredits({ artistName, artistAvatarId }) {
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

GalleryWindowCredits.propTypes = {
  artistAvatarId: PropTypes.string,
  artistName: PropTypes.string,
};

export default memo(GalleryWindowCredits);
