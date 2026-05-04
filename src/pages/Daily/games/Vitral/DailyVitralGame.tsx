// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyVitral } from './components/DailyVitral';
// Sass
import './utils/styles.scss';

export function DailyVitralGame() {
  return (
    <DailyGame
      gameName="vitrais"
      GameComponent={DailyVitral}
    />
  );
}
