import { useQuery } from '@tanstack/react-query';
// Utils
import { getToday } from 'utils/helpers';
// Pages
import { DemoGame } from 'pages/Daily/components/DailyGame';
import { wait } from 'pages/Daily/utils';
// Internal
import type { DailyPanicoEntry } from './utils/types';
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
    queryKey: ['panico-demo'],
    queryFn: async () => {
      // Simulate an API call to fetch demo data
      await wait(2000); // Simulate network delay
      return {
        id: getToday(),
        number: 0,
        type: 'panico',
        buttons: [
          '1::BASIC_PRESS',
          '2::BASIC_DO_NOT_PRESS',
          '3::SAME_AS_PREVIOUS',
          '4::TRICK_POLITE_DO_NOT_PRESS',
          '5::QUICK_DO_NOT_PRESS',
          '6::LOGIC_HUMAN_TRUE',
          '7::LOGIC_HUMAN_FALSE',
          '8::BASIC_PRESS',
        ],
      };
    },
  });
}
