// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyOrganiku } from './components/DailyOrganiku';
// Sass
import './utils/styles.scss';

export function DailyOrganikuGame() {
  return (
    <DailyGame
      GameComponent={DailyOrganiku}
      gameName="organiku"
    />
  );
}
