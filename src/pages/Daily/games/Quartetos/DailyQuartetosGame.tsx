import { DailyGameBetaRelease } from 'pages/Daily/components/DailyGame';
// Internal
import { useQuartetosDemo } from './utils/useQuartetosDemo';
import { SETTINGS } from './utils/settings';
import { DailyQuartetos } from './components/DailyQuartetos';
// Sass
import './utils/styles.scss';

export function DailyQuartetosGame() {
  return (
    <DailyGameBetaRelease
      gameName="quartetos"
      GameComponent={DailyQuartetos}
      useDemoHook={useQuartetosDemo}
      lsKey={SETTINGS.KEY}
    />
  );
}
