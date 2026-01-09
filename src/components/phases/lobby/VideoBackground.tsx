// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { useGameAppearance, useGameInfoContext } from 'components/session/GameInfoContext';
// Sass
import './VideoBackground.scss';

export function VideoBackground() {
  const info = useGameInfoContext();
  const gameAppearance = useGameAppearance();

  if (!gameAppearance?.videoBackground) {
    return null;
  }

  return (
    <div className="video-background">
      <video
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src={`${PUBLIC_URL.VIDEOS}${info.gameName}.mp4`}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
