import { Button, Card, Space, Table, TableColumnsType } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';

import { determineAttributePriorityResponse } from './bot-utils';
import { useClassifier } from './ClassifierContext';

import type { AlienItem } from './types';
import { Sign } from './Sign';
import { useNavigate } from 'react-router-dom';
import { DualTranslate, LanguageSwitch } from 'components/language';

export function Priority() {
  const { data } = useClassifier();
  const navigate = useNavigate();

  const columns: TableColumnsType<AlienItem> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Button shape="round" onClick={() => navigate(`dev/classifier?view=default&item=${id}`)}>
          {id}
        </Button>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <DualTranslate>{name}</DualTranslate>,
    },
    {
      title: 'Item',
      dataIndex: 'id',
      key: 'image',
      render: (id) => <ItemCard id={id} width={50} />,
    },
    {
      title: 'Priority',
      key: 'attributes',
      dataIndex: 'attributes',
      render: (_, item) => {
        const attributePriority = determineAttributePriorityResponse([item.id], { [item.id]: item });
        return (
          <Space size="small" className="priority-attributes">
            {attributePriority.map((attributeId) => (
              <Sign attribute={attributeId} key={attributeId} />
            ))}
          </Space>
        );
      },
    },
  ];

  return (
    <Space className="container classifier" direction="vertical">
      <Card title="Priority" extra={<LanguageSwitch />}>
        <Table columns={columns} dataSource={Object.values(data)} />
      </Card>
    </Space>
  );
}
