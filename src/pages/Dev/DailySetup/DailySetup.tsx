import { useTitle } from 'react-use';
// Ant Design Resources
import { Layout, TableColumnsType, Table, Button } from 'antd';
// Components

import { DevHeader } from '../DevHeader';
import { useLoadDailySetup, useSaveDailySetup } from './hooks';
import { CanvasSVG } from 'components/canvas';
import { DailyEntry } from './types';

function DailySetupPage() {
  useTitle('Daily Setup | Dev | Tarde Divertida');

  return (
    <Layout className="dev-layout">
      <DevHeader title="Daily Setup" />
      <Layout.Content className="dev-content">
        <ul>
          <li>Get history/useCards and latestDate</li>
          <li>Get data/suffixCounts</li>
          <li>Load all /data/drawingsPT</li>
          <li>Filter cards with more than 2 entries</li>
          <li>Filter cards that were already used</li>
          <li>Shuffle and build daily entries</li>
        </ul>
        <DataPopulation />
      </Layout.Content>
    </Layout>
  );
}

function DataPopulation() {
  const dataLoad = useLoadDailySetup();

  const columns: TableColumnsType<DailyEntry> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'CardId',
      dataIndex: 'cardId',
      key: 'cardId',
    },
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
      render: (text) => (
        <div>
          {text
            .split('')
            .map((l: string, i: number) => (i < 2 || l === ' ' ? l : '⏹'))
            .join('')}
        </div>
      ),
    },
    {
      title: 'Count',
      dataIndex: 'drawings',
      key: 'count',
      render: (drawings) => <div>{drawings.length}</div>,
    },
    {
      title: 'Drawings',
      dataIndex: 'drawings',
      key: 'drawings',
      render: (drawings) => (
        <div>
          {drawings.map((d: string) => (
            <CanvasSVG key={d} drawing={d} width={100} height={100} className="border round-corners margin" />
          ))}
        </div>
      ),
    },
  ];

  const { save, isLoading: isMutating } = useSaveDailySetup();

  return (
    <div>
      {dataLoad.isLoading && <div>Loading...</div>}
      <h1>Total: {dataLoad.entries.length}</h1>
      <Table columns={columns} dataSource={dataLoad.entries ?? []} />
      <Button
        onClick={() => save(dataLoad.entries)}
        loading={isMutating}
        disabled={(dataLoad.entries ?? []).length === 0}
      >
        Save
      </Button>
    </div>
  );
}

export default DailySetupPage;
