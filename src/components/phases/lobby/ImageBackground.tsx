// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Components
import { useGameAppearance, useGameInfoContext } from 'components/session/GameInfoContext';
// Sass
import './ImageBackground.scss';

export function ImageBackground() {
  const info = useGameInfoContext();
  const gameAppearance = useGameAppearance();
  const baseUrl = useTDBaseUrl('images');

  if (gameAppearance?.videoBackground) {
    return null;
  }

  return (
    <div
      className="lobby-image-background"
      style={{
        backgroundImage: `url('${baseUrl}/strips/strip-${info.gameName}.jpg')`,
      }}
    />
  );
}
