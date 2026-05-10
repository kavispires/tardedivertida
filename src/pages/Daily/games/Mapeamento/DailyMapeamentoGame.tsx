import { useQuery } from '@tanstack/react-query';
// Utils
import { getToday } from 'utils/helpers';
// Pages
import { DemoGame } from 'pages/Daily/components/DailyGame';
// Internal
import type { DailyMapeamentoEntry } from './utils/types';
import { DailyMapeamento } from './components/DailyMapeamento';
// Sass
import './utils/styles.scss';

export function DailyMapeamentoGame() {
  // return (
  //   <DailyGame
  //     gameName="mapeamento"
  //     GameComponent={DailyMapeamento}
  //   />
  // );

  return (
    <DemoGame
      GameComponent={DailyMapeamento}
      useDemoHook={useMapeamentoDemo}
      lsKey={''}
    />
  );
}

function useMapeamentoDemo() {
  return useQuery<DailyMapeamentoEntry>({
    queryKey: ['mapeamento-demo'],
    queryFn: async () => {
      // Simulate an API call to fetch demo data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      return {
        id: getToday(),
        number: 0,
        type: 'mapeamento',
        language: 'pt',
        location: 'Reino do Cogumelo',
        clues: [
          'Mundo colorido de canos',
          'Habitado por pequenos Toads',
          'Constantemente invadido por Bowser',
          'Governado pela Princesa Peach',
          'Onde Mario vive aventuras',
        ],
      };
    },
  });
}
