// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyArteRuim } from './components/DailyArteRuim';
// Sass
import './utils/styles.scss';

export function DailyArteRuimGame() {
  return (
    <DailyGame
      gameName="arte-ruim"
      GameComponent={DailyArteRuim}
    />
  );
}
