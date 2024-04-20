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

  while (result.length < N) {
    const randomNumbers = _.sampleSize(_.range(1, 1858), 21);
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
