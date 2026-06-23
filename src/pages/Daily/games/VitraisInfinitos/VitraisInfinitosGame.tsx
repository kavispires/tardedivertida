// Pages
import { EndlessGame } from '@pages/Daily/components/DailyGame';
// Internal
import { useEndlessVitrais } from './utils/useEndlessVitrais';
import { EndlessVitraisContent } from './components/EndlessVitraisContent';
// Sass
import './utils/styles.scss';

export function VitraisInfinitosGame() {
  return (
    <EndlessGame
      GameComponent={EndlessVitraisContent}
      useGameHook={useEndlessVitrais}
    />
  );
}
