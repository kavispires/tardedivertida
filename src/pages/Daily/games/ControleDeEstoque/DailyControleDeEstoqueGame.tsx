// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyControleDeEstoque } from './components/DailyControleDeEstoque';
// Sass
import './utils/styles.scss';

export function DailyControleDeEstoqueGame() {
  return <DailyGame gameName="controle-de-estoque" GameComponent={DailyControleDeEstoque} />;
}
