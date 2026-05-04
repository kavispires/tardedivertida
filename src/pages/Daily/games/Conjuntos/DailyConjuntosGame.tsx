// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyConjuntos } from './components/DailyConjuntos';
// Sass
import './utils/styles.scss';

export function DailyConjuntosGame() {
  return (
    <DailyGame
      gameName="teoria-de-conjuntos"
      GameComponent={DailyConjuntos}
    />
  );
}
