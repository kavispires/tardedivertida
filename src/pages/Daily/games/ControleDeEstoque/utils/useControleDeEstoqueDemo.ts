import { useQuery } from '@tanstack/react-query';
import { isDevEnv, print } from 'utils/helpers';

import { useLanguage } from 'hooks/useLanguage';
import { getSourceName, wait } from 'pages/Daily/utils';
import { DailyControleDeEstoqueEntry } from './types';
import { sampleSize, shuffle } from 'lodash';

type DemoResponse = {
  'controle-de-estoque': DailyControleDeEstoqueEntry;
};

const TOTAL_GOODS = 192;
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
        title: 'Demo',
        goods: [],
        orders: [],
      };

      if (isDevEnv) {
        const goods = Array(GOODS_SIZE + OUT_OF_STOCK_SIZE)
          .fill('')
          .map((_, i) => `good-${i + 1}`);

        const outOfStockGood = goods.pop();

        entry.goods = goods;
        entry.orders = Array(ORDER_SIZE)
          .fill('')
          .map((_, i) => `good-${i + 1}`);
        // Add non-available requests
        entry.orders.push(outOfStockGood!);
        entry.orders = shuffle(entry.orders);

        const responseData = {
          'controle-de-estoque': entry,
        };

        print({ demo: responseData }, 'table');
        return responseData;
      }

      const goods = sampleSize(
        Array(TOTAL_GOODS)
          .fill('')
          .map((_, i) => `good-${i + 1}`),
        GOODS_SIZE + OUT_OF_STOCK_SIZE
      );
      const outOfStockGood = goods.pop();

      entry.goods = goods;
      entry.orders = sampleSize(entry.goods, ORDER_SIZE);
      // Add non-available requests
      entry.orders.push(outOfStockGood!);
      entry.orders = shuffle(entry.orders);

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
