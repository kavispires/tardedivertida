// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { useGameInfoContext } from 'components/session/GameInfoContext';
// Sass
import './ImageBackground.scss';

export function ImageBackground() {
  const info = useGameInfoContext();

  return (
    <div
      className="lobby-image-background"
      style={{
        backgroundImage: `url('${PUBLIC_URL.STRIPS}strip-${info.gameName}.jpg')`,
      }}
    />
  );
}
