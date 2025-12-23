import { DailyGame, DemoGame } from 'pages/Daily/components/DailyGame';
// Internal
import { SETTINGS } from './utils/settings';
import { useGetVitraisDemo } from './utils/useGetVitraisDemo';
import { DailyVitrais } from './components/DailyVitrais';
// Sass
import './utils/styles.scss';

export function DailyVitraisGame() {
  return <DemoGame GameComponent={DailyVitrais} useDemoHook={useGetVitraisDemo} lsKey={SETTINGS.KEY} />;
}
