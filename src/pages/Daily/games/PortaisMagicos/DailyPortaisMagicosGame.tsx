import { DemoGame } from 'pages/Daily/components/DailyGame';
// Internal
import { usePortaisMagicosDemo } from './utils/usePortaisMagicosDemo';
import { DailyPortaisMagicos } from './components/DailyPortaisMagicos';
// Sass
import './utils/styles.scss';

export function DailyPortaisMagicosGame() {
  return <DemoGame GameComponent={DailyPortaisMagicos} useDailyHook={usePortaisMagicosDemo} />;
}
