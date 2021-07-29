import React from 'react';
// Design Resources
import { Layout, Progress, Table } from 'antd';
// Utils
import pastDrawings from '../resources/pastDrawings.json';
import CanvasSVG from './games/arte-ruim/CanvasSVG';
import { Title } from './shared';
import { orderBy } from '../utils';

function Gallery() {
  const dataSource = orderBy(
    Object.values(pastDrawings).reduce((acc, entry) => {
      const data = {
        id: entry.id,
        text: entry.text,
        level: entry.level,
      };

      entry.entries.forEach((drawingEntry) => {
        acc.push({
          ...data,
          drawing: drawingEntry.drawing,
          playerId: drawingEntry.playerId,
          successRate: drawingEntry.successRate,
          createdAt: drawingEntry.createdAt,
        });
      });
      return acc;
    }, []),
    ['level', 'id'],
    ['asc', 'asc']
  );

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (v) => Array(v).fill('☆').join(''),
    },
    {
      title: 'Artist',
      dataIndex: 'playerId',
      key: 'playerId',
    },
    {
      title: 'Created On',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Drawing',
      dataIndex: 'drawing',
      key: 'drawing',
      render: (v) => <CanvasSVG drawing={v} className="a-evaluation-all-drawings__drawing" />,
    },
    {
      title: 'Success Rate',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (v) => <Progress type="circle" percent={v ? v * 100 : 0} width={80} />,
    },
  ];

  return (
    <Layout.Content className="container">
      <Title>Galeria</Title>
      <Table dataSource={dataSource} columns={columns} />
    </Layout.Content>
  );
}

export default Gallery;
