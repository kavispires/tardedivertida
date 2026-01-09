import { random, sample, shuffle } from 'lodash';
// Pages
import { DemoGame } from 'pages/Daily/components/DailyGame';
// Internal
import { DailyDemoContent } from './components/DailyDemoContent';
// Sass
import './utils/styles.scss';

export function DailyDemoPage() {
  return (
    <DemoGame
      GameComponent={DailyDemoContent}
      useDemoHook={() => ({
        isLoading: false,
        data: {
          id: 'example',
          number: 1,
          type: 'vitrais',
          title: 'Example Puzzle',
          cardId: `td-d${random(1, 12)}-${random(10, 252)}`,
          pieces: shuffle(Array.from({ length: sample([12, 15, 18, 21, 24]) }, (_, i) => i)),
        },
      })}
      lsKey={''}
    />
  );
}
