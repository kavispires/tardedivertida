// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { useGameAppearance, useGameInfoContext } from 'components/session/GameInfoContext';
// Sass
import './ImageBackground.scss';

export function ImageBackground() {
  const info = useGameInfoContext();
  const gameAppearance = useGameAppearance();

  if (gameAppearance?.videoBackground) {
    return null;
  }

  return (
    <div
      className="lobby-image-background"
      style={{
        backgroundImage: `url('${PUBLIC_URL.STRIPS}strip-${info.gameName}.jpg')`,
      }}
    />
  );
}
