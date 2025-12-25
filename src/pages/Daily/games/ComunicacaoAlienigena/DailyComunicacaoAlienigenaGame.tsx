// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyComunicacaoAlienigena } from './components/DailyComunicacaoAlienigena';
// Sass
import './utils/styles.scss';

export function DailyComunicacaoAlienigenaGame() {
  return <DailyGame gameName="comunicacao-alienigena" GameComponent={DailyComunicacaoAlienigena} />;
}
