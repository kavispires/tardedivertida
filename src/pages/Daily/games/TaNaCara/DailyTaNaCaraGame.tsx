import { DemoGame } from 'pages/Daily/components/DailyGame';
// Internal
import { useTaNaCaraDemo } from './utils/useTaNaCaraDemo';
import { SETTINGS } from './utils/settings';
import { DailyTaNaCara } from './components/DailyTaNaCara';
// Sass
import './utils/styles.scss';

export function DailyTaNaCaraGame() {
  return <DemoGame GameComponent={DailyTaNaCara} useDailyHook={useTaNaCaraDemo} lsKey={SETTINGS.KEY} />;
}
