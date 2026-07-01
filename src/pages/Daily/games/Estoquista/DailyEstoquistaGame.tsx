// Pages
import { SelfGeneratingGame } from '@pages/Daily/components/DailyGame';
// Internal
import { useEstoquistaGameGenerator } from './utils/generator';
import { DailyEstoquista } from './components/DailyEstoquista';
// Sass
import './utils/styles.scss';

export function DailyEstoquistaGame() {
  return (
    <SelfGeneratingGame
      GameComponent={DailyEstoquista}
      useGameHook={useEstoquistaGameGenerator}
    />
  );
}
