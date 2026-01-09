// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyPalavreado } from './components/DailyPalavreado';
// Sass
import './utils/styles.scss';

export function DailyPalavreadoGame() {
  return (
    <DailyGame
      gameName="palavreado"
      GameComponent={DailyPalavreado}
    />
  );
}
