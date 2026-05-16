import { useQuery } from '@tanstack/react-query';
import { sample } from 'lodash';
// Pages
import { DemoGame } from 'pages/Daily/components/DailyGame';
// Internal
import { generatePuzzle } from './utils/pirralhos-generator';
import { DailyPirralhos } from './components/DailyPirralhos';
// Sass
import './utils/styles.scss';

export function DailyPirralhosGame() {
  // return (
  //   <DailyGame
  //     gameName="pirralhos"
  //     GameComponent={DailyMapeamento}
  //   />
  // );

  return (
    <DemoGame
      GameComponent={DailyPirralhos}
      useDemoHook={useDemoHook}
      lsKey={''}
    />
  );
}

function useDemoHook() {
  return useQuery({
    queryKey: ['pirralhos-demo'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        const kids = sample([4, 4, 5, 5, 5, 5, 6, 6, 7]);
        const liars = kids > 5 ? sample([1, 2, 3]) : sample([1, 1, 1, 1, 2]);
        const newGame = generatePuzzle(kids, 1, liars);

        return newGame;
      } catch (error) {
        throw new Error('Failed to generate demo puzzle', { cause: error });
      }
    },
  });
}
