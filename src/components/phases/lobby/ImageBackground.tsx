// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Components
import { useGameAppearance, useGameInfoContext } from 'components/session/GameInfoContext';
// Sass
import styles from './ImageBackground.module.scss';

/**
 * Background component that displays a static image background for the lobby based on game appearance settings
 */
export function ImageBackground() {
  const info = useGameInfoContext();
  const gameAppearance = useGameAppearance();
  const baseUrl = useTDBaseUrl('images');

  if (gameAppearance?.videoBackground) {
    return null;
  }

  return (
    <div
      className={styles.lobbyImageBackground}
      style={{
        backgroundImage: `url('${baseUrl}/strips/strip-${info.gameName}.jpg')`,
      }}
    />
  );
}
