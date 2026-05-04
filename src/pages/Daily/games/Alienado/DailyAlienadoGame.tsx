// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyAlienado } from './components/DailyAlienado';
// Sass
import './utils/styles.scss';

export function DailyAlienadoGame() {
  return (
    <DailyGame
      gameName="comunicacao-alienigena"
      GameComponent={DailyAlienado}
    />
  );
}
