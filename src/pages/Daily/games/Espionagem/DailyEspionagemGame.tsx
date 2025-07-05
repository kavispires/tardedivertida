import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyEspionagem } from './components/DailyEspionagem';
// Sass
import './utils/styles.scss';

export function DailyEspionagemGame() {
  return <DailyGame gameName="espionagem" GameComponent={DailyEspionagem} />;
}
