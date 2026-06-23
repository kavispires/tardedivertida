// Pages
import { DailyGame } from '@pages/Daily/components/DailyGame';
// Internal
import { DailyPirralhos } from './components/DailyPirralhos';
// Sass
import './utils/styles.scss';

export function DailyPirralhosGame() {
  return (
    <DailyGame
      gameName="pirralhos"
      GameComponent={DailyPirralhos}
    />
  );
}
