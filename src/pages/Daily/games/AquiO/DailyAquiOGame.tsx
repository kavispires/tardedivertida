import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyAquiO } from './components/DailyAquiO';
// Sass
import './utils/styles.scss';

export function DailyAquiOGame() {
  return <DailyGame gameName="aqui-o" GameComponent={DailyAquiO} />;
}
