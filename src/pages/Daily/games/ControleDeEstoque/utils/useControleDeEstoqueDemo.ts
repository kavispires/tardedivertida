import { useQuery } from '@tanstack/react-query';
import { isDevEnv, print } from 'utils/helpers';

import { useLanguage } from 'hooks/useLanguage';
import { getSourceName, wait } from 'pages/Daily/utils';
import { DailyControleDeEstoqueEntry } from './types';
import { sampleSize, shuffle } from 'lodash';

type DemoResponse = {
  'controle-de-estoque': DailyControleDeEstoqueEntry;
};

const GOODS_SIZE = 16;
const ORDER_SIZE = 4;
const OUT_OF_STOCK_SIZE = 1;

export function useControleDeEstoqueDemo(today: string) {
  const { language } = useLanguage();
  const collectionName = getSourceName(language);

  // Load challenge
  return useQuery<DemoResponse>({
    queryKey: ['controle-de-estoque-demo'],
    queryFn: async () => {
      console.count(`Fetching ${collectionName} demo...`);
      await wait(1000);

      const entry: DailyControleDeEstoqueEntry = {
        id: today,
        number: 0,
        type: 'controle-de-estoque',
        language: 'pt',
        title: 'Segunda-feira',
        goods: [],
        orders: [],
      };

      // Fixed result during dev
      if (isDevEnv) {
        entry.goods = Array(GOODS_SIZE)
          .fill('')
          .map((_, i) => `good-${i + 1}`);
        entry.orders = Array(ORDER_SIZE)
          .fill('')
          .map((_, i) => `good-${i + 1}`);
        // Add non-available requests
        entry.orders.push(...sampleSize(['good-17', 'good-18'], OUT_OF_STOCK_SIZE));
      } else {
        entry.goods = shuffle(
          sampleSize(
            Array(48)
              .fill('')
              .map((_, i) => `good-${i + 1}`),
            GOODS_SIZE
          )
        );
        entry.orders = shuffle(sampleSize(entry.goods, ORDER_SIZE));
        // Add non-available requests
        entry.orders.push(
          ...sampleSize(
            Array(GOODS_SIZE)
              .fill('')
              .map((_, i) => `good-${i + 49}`),
            OUT_OF_STOCK_SIZE
          )
        );
        entry.orders = shuffle(entry.orders);
      }

      const responseData = {
        'controle-de-estoque': entry,
      };

      print({ demo: responseData }, 'table');
      return responseData;
    },
    enabled: language === 'pt',
    retry: false,
  });
}
