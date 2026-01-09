// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyQuartetos } from './components/DailyQuartetos';
// Sass
import './utils/styles.scss';

export function DailyQuartetosGame() {
  return (
    <DailyGame
      gameName="quartetos"
      GameComponent={DailyQuartetos}
    />
  );
}
