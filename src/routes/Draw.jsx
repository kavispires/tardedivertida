import React, { useEffect, useState } from 'react';
// Design Resources
import { Card, Layout, Progress, Space } from 'antd';
// Utils
import { orderBy } from '../utils';
import { PUBLIC_URL } from '../utils/constants';
// Components
import { LoadingPage } from '../components/loaders';
import { DrawingCanvas } from '../components/canvas';
import { Title } from '../components/shared';

function Draw() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lines, setLines] = useState([]);

  // if (isLoading) {
  //   return <LoadingPage />;
  // }

  return (
    <Layout.Content className="container">
      <Title>Draw</Title>

      <Space wrap className="gallery">
        <DrawingCanvas lines={lines} setLines={setLines} />
      </Space>
    </Layout.Content>
  );
}

export default Draw;
