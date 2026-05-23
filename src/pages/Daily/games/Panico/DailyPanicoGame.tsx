import { useQuery } from '@tanstack/react-query';
import { random } from 'lodash';
// Utils
import { getToday } from 'utils/helpers';
// Pages
import { DemoGame } from 'pages/Daily/components/DailyGame';
import { wait } from 'pages/Daily/utils';
// Internal
import type { DailyPanicoEntry } from './utils/types';
import { BUTTONS_LIBRARY, POOLS } from './utils/data';
import { generateGameSequence } from './utils/generator';
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

      let allButtons: string[] = [];
      let sampleTest: string[] = [];
      let sampleTestAllPools: string[] = [];

      try {
        allButtons = Object.values(BUTTONS_LIBRARY).map((button, index) => {
          let id = `${index + 1};;${button.key}`;
          if (button.pool) {
            id += `;;${random(0, Object.values(POOLS[button.pool]).length - 1)}`;
          }

          return id;
        });

        // console.log('All buttons built successfully:', allButtons);
      } catch (error) {
        console.error('Error building all buttons:', error);
        throw error; // Rethrow the error after logging it
      }

      console.log('ALL KEYS', Object.keys(BUTTONS_LIBRARY));

      try {
        sampleTest = [
          'BASIC_PRESS',
          // 'RED_BUTTON',
          // 'YELLOW_BUTTON',
          // 'BLUE_BUTTON',
          // 'SEE_SOMETHING_PRESS_ASIDE',
          // 'WHEN_YOU_SEE_RULE_AVOID',
          // 'SEE_SOMETHING_PRESS_AVOID',
          // 'SEE_AND_COUNT',
          // 'ICON_COMPARISON',
          // 'MISSING_NUMBER',
          // 'LONG_INSTRUCTION',
          // 'ROMAN_NUMERALS',
          'WHEN_YOU_SEE_RULE',
          'SPINNING_ICONS',
          'SPINNING_ICONS',
          'COLOR_GRID',
          'COLOR_GRID',
          'ALL_SAME_RULE',
          'SEE_SAME_THINGS_PRESS',
          'SEE_SAME_THINGS_PRESS',
          'FINAL_PRESS',
        ]
          .map((key) => BUTTONS_LIBRARY[key])
          .map((button, index) => {
            let id = `${index + 1};;${button.key}`;
            if (button.pool) {
              id += `;;${random(0, Object.values(POOLS[button.pool]).length - 1)}`;
            }

            return id;
          });
      } catch (error) {
        console.error('Error building sample buttons:', error);
        throw error; // Rethrow the error after logging it
      }

      try {
        sampleTestAllPools = [
          'BASIC_PRESS',
          // 'RED_BUTTON',
          // 'YELLOW_BUTTON',
          // 'BLUE_BUTTON',
          // 'SEE_SOMETHING_PRESS_ASIDE',
          // 'WHEN_YOU_SEE_RULE_AVOID',
          // 'SEE_SOMETHING_PRESS_AVOID',
          // 'SEE_AND_COUNT',
          // 'ICON_COMPARISON',
          // 'MISSING_NUMBER',
          // 'LONG_INSTRUCTION',
          // 'ROMAN_NUMERALS',
          // 'WHEN_YOU_SEE_RULE',
          // 'SPINNING_ICONS',
          // 'COLOR_GRID',
          // 'ALL_SAME_RULE',
          // 'SEE_SAME_THINGS_PRESS',
          'COLOR_WORD_RULE',
          'COLOR_WORD',
          'FINAL_PRESS',
        ]
          .map((key) => BUTTONS_LIBRARY[key])
          .flatMap((button, index) => {
            if (button.pool) {
              if (button.dependsOn) {
                return Object.keys(POOLS[button.pool]).map((_, poolIndex) => {
                  const poolId = `${index + 1};;${button.key};;${poolIndex}`;
                  return poolId;
                });
              }
              return `${index + 1};;${button.key};;${random(0, Object.values(POOLS[button.pool]).length - 1)}`;
            }
            const id = `${index + 1};;${button.key}`;

            return id;
          });
      } catch (error) {
        console.error('Error building sample buttons:', error);
        throw error; // Rethrow the error after logging it
      }

      // const sample = allButtons;
      // const sample = sampleTest;
      // const sample = sampleTestAllPools;
      const sample = generateGameSequence();
      return {
        ...placeholder,
        buttons: sample,
      };
    },
  });
}
