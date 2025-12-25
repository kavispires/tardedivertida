// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyPicaco } from './components/DailyPicaco';
// Sass
import './utils/styles.scss';

export function DailyPicacoGame() {
  return <DailyGame gameName="artista" GameComponent={DailyPicaco} />;
}
