// Hooks
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
// Sass
import './HomeVideoBackground.scss';

export function HomeVideoBackground() {
  const BASE_URL = useTDBaseUrl('assets');

  return (
    <div className="video-background">
      <video
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src={`${BASE_URL}/videos/home.mp4`}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
