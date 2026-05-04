// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyPortais } from './components/DailyPortais';
// Sass
import './utils/styles.scss';

export function DailyPortaisGame() {
  return (
    <DailyGame
      gameName="portais-magicos"
      GameComponent={DailyPortais}
    />
  );
}
