// Pages
import { EndlessGame } from 'pages/Daily/components/DailyGame';
// Internal
import { useEndlessVitrais } from './utils/useInfiniteVitrais';
import { InfiniteVitraisContent } from './components/InfiniteVitraisContent';
// Sass
import './utils/styles.scss';

export function InfiniteVitraisPage() {
  return (
    <EndlessGame
      GameComponent={InfiniteVitraisContent}
      useGameHook={useEndlessVitrais}
    />
  );
}
