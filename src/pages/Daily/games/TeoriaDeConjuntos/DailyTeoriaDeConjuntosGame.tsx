import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyTeoriaDeConjuntos } from './components/DailyTeoriaDeConjuntos';
// Sass
import './utils/styles.scss';

export function DailyTeoriaDeConjuntosGame() {
  return <DailyGame gameName="teoria-de-conjuntos" GameComponent={DailyTeoriaDeConjuntos} />;
}
