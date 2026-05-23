import { useQuery } from '@tanstack/react-query';
// Utils
import { getToday } from 'utils/helpers';
// Pages
import { DemoGame } from 'pages/Daily/components/DailyGame';
import { wait } from 'pages/Daily/utils';
// Internal
import type { DailyPanicoEntry } from './utils/types';
import { generators } from './utils/generator';
import { DailyPanico } from './components/DailyPanico';
// Sass
import './utils/styles.scss';

export function DailyPanicoGame() {
  // return (
  //   <DailyGame
  //     GameComponent={DailyPanico}
  //     gameName="panico"
  //   />
  // );

  return (
    <DemoGame
      GameComponent={DailyPanico}
      useDemoHook={usePanicoDemo}
      lsKey={'panico-demo'}
    />
  );
}

function usePanicoDemo() {
  return useQuery<DailyPanicoEntry>({
    queryKey: ['panico-demo', Date.now],
    queryFn: async () => {
      localStorage.removeItem('TD_DAILY_PANICO_LOCAL_TODAY');
      localStorage.removeItem('TD_DAILY_PANICO_LOCAL_PLAYED');
      // Simulate an API call to fetch demo data
      await wait(1000); // Simulate network delay
      const placeholder: DailyPanicoEntry = {
        id: `${getToday()}-${Date.now()}`,
        number: 0,
        type: 'panico',
        buttons: [],
      };

      return {
        ...placeholder,
        // Proper sequence generation for demo purposes
        buttons: generators.generateGameSequence().sequence,
        // All buttons
        // buttons: generators.generateAllButtonsSequence(),
        // Sample test sequence
        // buttons: generators.generateSampleTestSequence(),
        // Sample test sequence with all pools
        // buttons: generators.generateSampleTestAllPoolsSequence(),
      };
    },
  });
}
