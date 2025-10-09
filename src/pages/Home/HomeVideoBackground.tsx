// Utils
import { PUBLIC_URL } from 'utils/constants';
// Sass
import './HomeVideoBackground.scss';

export function HomeVideoBackground() {
  return (
    <div className="video-background">
      <video autoPlay muted loop playsInline>
        <source src={`${PUBLIC_URL.VIDEOS}home.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
