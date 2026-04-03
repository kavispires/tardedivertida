// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyConexoes } from './components/DailyConexoes';

export function DailyConexoesGame() {
  return (
    <DailyGame
      gameName="conexoes"
      GameComponent={DailyConexoes}
    />
  );
}
