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

  if (!gameAppearance?.videoBackground) {
    return null;
  }

  return (
    <div className={styles.videoBackground}>
      <video
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src={`${BASE_URL}/videos/${info.gameName}.mp4`}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
