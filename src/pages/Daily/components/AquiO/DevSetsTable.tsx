import { Flex, Space, Switch, Table } from 'antd';
import { AcheIssoSet } from 'pages/Daily/utils/types';
import type { TableProps } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import _, { orderBy } from 'lodash';
import { LETTERS } from 'utils/constants';
import sets from './sets.json';
import miscSets from './misc-sets.json';
import { useState } from 'react';
import { removeDuplicates } from 'utils/helpers';

function orderSets(givenSets: AcheIssoSet[]) {
  return orderBy(givenSets, [(s) => s.itemsIds[1]]).map((s) => ({
    ...s,
    itemsIds: orderBy(s.itemsIds, (id) => Number(id)),
  }));
}

const ALL_SETS: AcheIssoSet[] = orderSets(sets);
const MISC_SETS: AcheIssoSet[] = orderSets(miscSets);

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
      render: (itemsIds: string[]) =>
        removeDuplicates(itemsIds).filter(Boolean).length === 22 ? 'Yes' : 'No',
    },
  ];

  const [selectedSet, setSelectedSet] = useState('set');

  return (
    <Space direction="vertical">
      <Space>
        <Switch
          checkedChildren="Set"
          unCheckedChildren="Misc"
          defaultChecked
          onChange={() => setSelectedSet(selectedSet === 'set' ? 'misc' : 'set')}
        />
      </Space>
      <Table columns={columns} dataSource={selectedSet === 'set' ? ALL_SETS : MISC_SETS} />
    </Space>
  );
}

function generateUniqueArrays(N: number): string[][] {
  const result: number[][] = [];
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
  let previouslyUsedIds: BooleanDictionary = {
    ..._.fromPairs(nsfwIds.map((key) => [key, true])),
  };
  ALL_SETS.forEach((set) => set.itemsIds.forEach((id) => (previouslyUsedIds[id] = true)));

  let range = _.range(1, 1858).filter((n) => !previouslyUsedIds[n] && !nsfwIds.includes(String(n)));
  while (result.length < N) {
    const randomNumbers = _.sampleSize(range, 21);
    if (!result.some((arr) => _.isEqual(arr, randomNumbers))) {
      previouslyUsedIds = { ...previouslyUsedIds, ..._.fromPairs(randomNumbers.map((key) => [key, true])) };
      range = range.filter((n) => !randomNumbers.includes(n));
      result.push([0, ...randomNumbers]);
    }
  }

  return result.map((arr) => orderBy(arr.map(String), (id) => Number(id)));
}

export function generateSets() {
  const sets = generateUniqueArrays(LETTERS.length).map((items, i) => ({
    title: {
      pt: `Diversos ${LETTERS[i]}`,
      en: `Misc ${LETTERS[i]}`,
    },
    itemsIds: items,
  }));

  console.log(JSON.stringify(sets));
}

generateSets();
