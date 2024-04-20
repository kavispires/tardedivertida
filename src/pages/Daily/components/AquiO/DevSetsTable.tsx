import { Flex, Table } from 'antd';
import { AcheIssoSet } from 'pages/Daily/utils/types';
import type { TableProps } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import _ from 'lodash';
import { LETTERS } from 'utils/constants';
import sets from './sets.json';
import miscSets from './misc-sets.json';

const ALL_SETS: AcheIssoSet[] = sets;
const MISC_SETS: AcheIssoSet[] = miscSets;

export function DevSetsTable() {
  const columns: TableProps<AcheIssoSet>['columns'] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <span>{title.pt}</span>,
    },
    {
      title: 'Items',
      dataIndex: 'itemsIds',
      key: 'itemsIds',
      render: (itemsIds: string[], record) => (
        <Flex gap={6} wrap="wrap" key={`items-${record.title.en}`}>
          {itemsIds.map((itemId) => (
            <Flex key={`${record.title.en}-${itemId}`} gap={2} vertical>
              <ItemCard id={itemId} width={60} />
              <Flex justify="center">{itemId}</Flex>
            </Flex>
          ))}
        </Flex>
      ),
    },
    {
      title: 'Complete',
      dataIndex: 'itemsIds',
      key: 'complete',
      render: (itemsIds: string[]) => (itemsIds.filter(Boolean).length === 22 ? 'Yes' : 'No'),
    },
  ];

  return <Table columns={columns} dataSource={MISC_SETS} />;
}

function generateUniqueArrays(N: number): string[][] {
  const result: number[][] = [];
  const previouslyUsedIds: BooleanDictionary = {};
  ALL_SETS.forEach((set) => set.itemsIds.forEach((id) => (previouslyUsedIds[id] = true)));
  const nsfwIds = [
    '239',
    '331',
    '256',
    '383',
    '420',
    '433',
    '584',
    '683',
    '769',
    '1122',
    '1174',
    '1188',
    '1316',
    '1320',
    '1388',
    '1396',
    '1480',
    '1549',
    '1550',
    '1591',
    '1677',
    '1778',
    '1790',
    '1792',
    '1820',
  ];
  const range = _.range(1, 1858).filter((n) => !previouslyUsedIds[n] && !nsfwIds.includes(String(n)));
  while (result.length < N) {
    const randomNumbers = _.sampleSize(range, 21);
    if (!result.some((arr) => _.isEqual(arr, randomNumbers))) {
      result.push([0, ...randomNumbers]);
    }
  }

  return result.map((arr) => arr.map(String));
}

export function generateSets() {
  const sets = generateUniqueArrays(20).map((items, i) => ({
    title: {
      pt: `Diversos ${LETTERS[i]}`,
      en: `Misc ${LETTERS[i]}`,
    },
    itemsIds: items,
  }));

  console.log(JSON.stringify(sets));
}

generateSets();
