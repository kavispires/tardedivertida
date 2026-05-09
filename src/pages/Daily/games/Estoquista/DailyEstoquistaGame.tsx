// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyEstoquista } from './components/DailyEstoquista';
// Sass
import './utils/styles.scss';

export function DailyEstoquistaGame() {
  return (
    <DailyGame
      gameName="estoquista"
      GameComponent={DailyEstoquista}
    />
  );
}
