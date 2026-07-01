// Pages
import { SelfGeneratingGame } from '@pages/Daily/components/DailyGame';
// Internal
import { useEndlessVitrais } from './utils/useEndlessVitrais';
import { EndlessVitraisContent } from './components/EndlessVitraisContent';
// Sass
import './utils/styles.scss';

export function VitraisInfinitosGame() {
  return (
    <SelfGeneratingGame
      GameComponent={EndlessVitraisContent}
      useGameHook={useEndlessVitrais}
    />
  );
}
