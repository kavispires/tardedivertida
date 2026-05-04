// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyInvestigacao } from './components/DailyInvestigacao';
// Sass
import './utils/styles.scss';

export function DailyInvestigacaoGame() {
  return (
    <DailyGame
      gameName="investigacao"
      GameComponent={DailyInvestigacao}
    />
  );
}
