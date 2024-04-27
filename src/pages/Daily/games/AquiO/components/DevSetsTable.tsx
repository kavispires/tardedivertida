import { Flex, Space, Switch, Table } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { fromPairs, isEqual, orderBy, range, sampleSize } from 'lodash';
import { useState } from 'react';
import { LETTERS } from 'utils/constants';
import { removeDuplicates } from 'utils/helpers';

import miscSets from '../data/misc-sets.json';
import sets from '../data/sets.json';
import { AquiOSet } from '../utils/types';

import type { TableProps } from 'antd';
function orderSets(givenSets: AquiOSet[]) {
  return orderBy(givenSets, [(s) => s.itemsIds[1]]).map((s) => ({
    ...s,
    itemsIds: orderBy(s.itemsIds, (id) => Number(id)),
  }));
}

const ALL_SETS: AquiOSet[] = orderSets(sets);
const MISC_SETS: AquiOSet[] = orderSets(miscSets);

export function DevSetsTable() {
  const columns: TableProps<AquiOSet>['columns'] = [
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
    ...fromPairs(nsfwIds.map((key) => [key, true])),
  };
  ALL_SETS.forEach((set) => set.itemsIds.forEach((id) => (previouslyUsedIds[id] = true)));

  let availableRange = range(1, 1858).filter((n) => !previouslyUsedIds[n] && !nsfwIds.includes(String(n)));
  while (result.length < N) {
    const randomNumbers = sampleSize(availableRange, 21);
    if (!result.some((arr) => isEqual(arr, randomNumbers))) {
      previouslyUsedIds = { ...previouslyUsedIds, ...fromPairs(randomNumbers.map((key) => [key, true])) };
      availableRange = availableRange.filter((n) => !randomNumbers.includes(n));
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
