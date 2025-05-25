import { DemoGame } from 'pages/Daily/components/DailyGame';
// Internal
import { useEspionagemDemo } from './utils/useEspionagemDemo';
import { SETTINGS } from './utils/settings';
import { DailyEspionagem } from './components/DailyEspionagem';
// Sass
import './utils/styles.scss';

export function DailyEspionagemGame() {
  return <DemoGame GameComponent={DailyEspionagem} useDemoHook={useEspionagemDemo} lsKey={SETTINGS.KEY} />;
}
