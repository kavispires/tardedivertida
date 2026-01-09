// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyPortaisMagicos } from './components/DailyPortaisMagicos';
// Sass
import './utils/styles.scss';

export function DailyPortaisMagicosGame() {
  return (
    <DailyGame
      gameName="portais-magicos"
      GameComponent={DailyPortaisMagicos}
    />
  );
}
