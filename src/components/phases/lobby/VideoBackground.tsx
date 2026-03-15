import { useState } from 'react';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Components
import { useGameAppearance, useGameInfoContext } from 'components/session/GameInfoContext';
// Sass
import styles from './VideoBackground.module.scss';

export function VideoBackground() {
  const BASE_URL = useTDBaseUrl('assets');
  const info = useGameInfoContext();
  const gameAppearance = useGameAppearance();
  const [error, setError] = useState(false);

  if (error || !gameAppearance?.videoBackground) {
    return (
      <div className={styles.videoBackground}>
        <video
          key="fallback-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src={`${BASE_URL}/videos/em-breve.mp4`}
            type="video/mp4"
          />
        </video>
      </div>
    );
  }

  return (
    <div className={styles.videoBackground}>
      <video
        key="game-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src={`${BASE_URL}/videos/${info.gameName}.mp4`}
          type="video/mp4"
          onError={() => setError(true)}
        />
      </video>
    </div>
  );
}
