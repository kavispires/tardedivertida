import { Radio, RadioChangeEvent, Space, Table, TableColumnType, Tag } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { LoadingPage } from 'components/loaders';
import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { useTitle } from 'react-use';
import { PUBLIC_URL } from 'utils/constants';

import { useQuery } from '@tanstack/react-query';

import { DevHeader } from '../DevHeader';
import { ConnectionGroup, GroupSummary, ItemGroup } from './types';

/**
 * Item Connections game
 * Get item A with 2 groups of at least 4 items where the only connection is item A
 * Get one of these groups
 * Get the other group but without the item A
 * Get another 2 groups that don't contain any of the items from the first 2 groups
 */

type ConnectItemsContentProps = {
  data: Collection<ConnectionGroup>;
};

function ConnectItemsContent({ data }: ConnectItemsContentProps) {
  const [view, setView] = useState('groups');
  console.log({ data });

  const sortedData = useMemo(
    () =>
      orderBy(
        Object.values(data).filter((e) => e.items.length > 0),
        [(v) => v.items.length, 'difficulty'],
        ['asc', 'asc']
      ),
    [data]
  );

  const itemCount: ItemGroup[] = useMemo(() => {
    const items: Record<string, GroupSummary[]> = {};
    sortedData.forEach((group) => {
      group.items.forEach((item) => {
        if (group.items.length >= 3) {
          if (!items[item]) {
            items[item] = [];
          }
          items[item].push({
            groupId: group.id,
            name: group.name,
            items: group.items.map(String),
            count: group.items.length,
          });
        }
      });
    });
    return orderBy(
      Object.entries(items).map(([itemId, groups]) => ({
        itemId,
        groups,
        total: groups.length,
      })),
      ['total'],
      ['desc']
    );
  }, [sortedData]);

  console.log({ itemCount });

  return (
    <Space className="container classifier full-width" direction="vertical">
      <Radio.Group
        options={[
          { label: 'Groups', value: 'groups' },
          { label: 'Items', value: 'items' },
        ]}
        onChange={({ target: { value } }: RadioChangeEvent) => setView(value)}
        value={view}
        optionType="button"
      />

      {view === 'groups' && <GroupTable dataSource={sortedData} />}
      {view === 'items' && <ItemsTable dataSource={itemCount} />}
    </Space>
  );
}

type GroupTableProps = {
  dataSource: ConnectionGroup[];
};

function GroupTable({ dataSource }: GroupTableProps) {
  const columns: TableColumnType<ConnectionGroup>[] = [
    {
      title: 'Group',
      dataIndex: 'name',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      render: (items: number[], row) => (
        <Space wrap>
          {items.map((item) => (
            <ItemCard key={`${row.id}-${item}`} id={String(item)} />
          ))}
        </Space>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
    },
  ];

  return <Table columns={columns} dataSource={dataSource} pagination={false} size="small" bordered />;
}

type ItemsTableProps = {
  dataSource: ItemGroup[];
};

function ItemsTable({ dataSource }: ItemsTableProps) {
  const columns: TableColumnType<ItemGroup>[] = [
    {
      title: 'Item Id',
      dataIndex: 'itemId',
    },
    {
      title: 'Item',
      dataIndex: 'itemId',
      render: (id) => <ItemCard id={id} />,
    },
    {
      title: 'Groups',
      dataIndex: 'groups',
      render: (groups: GroupSummary[], row) => (
        <Space wrap>
          {groups.map((group) => (
            <Tag key={`${row.itemId}-${group.name}`}>
              {group.name} ({group.count})
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
    },
  ];

  return <Table columns={columns} dataSource={dataSource} pagination={false} size="small" bordered />;
}

function ConnectItemsPage() {
  useTitle('Items Connections | Dev | Tarde Divertida');

  const { data, isLoading, isSuccess } = useQuery<Collection<ConnectionGroup>>({
    queryKey: ['connect-items'],
    queryFn: async () => {
      const response = await fetch(`${PUBLIC_URL.RESOURCES}/connect-items.json`);
      return await response.json();
    },
  });

  return (
    <div>
      <DevHeader
        title="Items Connections"
        // extra={<Segmented options={segments} defaultValue={view} onChange={(v: any) => qp.add('view', v)} />}
      />
      {isLoading && <LoadingPage />}
      {isSuccess && <ConnectItemsContent data={data} />}
    </div>
  );
}

export default ConnectItemsPage;
