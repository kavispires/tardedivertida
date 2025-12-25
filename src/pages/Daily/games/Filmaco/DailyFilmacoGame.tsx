// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyFilmaco } from './components/DailyFilmaco';
// Sass
import './utils/styles.scss';

export function DailyFilmacoGame() {
  return <DailyGame gameName="filmaco" GameComponent={DailyFilmaco} />;
}
