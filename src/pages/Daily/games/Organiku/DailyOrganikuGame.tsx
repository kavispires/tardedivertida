import { DemoGame } from 'pages/Daily/components/DailyGame';
// Internal
import { useOrganikuDemo } from './utils/useOrganikuDemo';
import { SETTINGS } from './utils/settings';
import { DailyOrganiku } from './components/DailyOrganiku';
// Sass
import './utils/styles.scss';

export function DailyOrganikuGame() {
  return <DemoGame GameComponent={DailyOrganiku} useDemoHook={useOrganikuDemo} lsKey={SETTINGS.KEY} />;
}
