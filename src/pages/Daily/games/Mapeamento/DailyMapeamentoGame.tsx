// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyMapeamento } from './components/DailyMapeamento';
// Sass
import './utils/styles.scss';

export function DailyMapeamentoGame() {
  return (
    <DailyGame
      gameName="mapeamento"
      GameComponent={DailyMapeamento}
    />
  );
}
