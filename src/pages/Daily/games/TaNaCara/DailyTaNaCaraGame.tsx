// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyTaNaCara } from './components/DailyTaNaCara';
// Sass
import './utils/styles.scss';

export function DailyTaNaCaraGame() {
  return <DailyGame gameName="ta-na-cara" GameComponent={DailyTaNaCara} />;
}
