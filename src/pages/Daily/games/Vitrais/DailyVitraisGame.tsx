import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyVitrais } from './components/DailyVitrais';
// Sass
import './utils/styles.scss';

export function DailyVitraisGame() {
  return <DailyGame gameName="vitrais" GameComponent={DailyVitrais} />;
}
