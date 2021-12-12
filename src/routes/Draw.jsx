import React, { useState } from 'react';
// Design Resources
import { Layout, Space } from 'antd';
// Components
import { DrawingCanvas } from '../components/canvas';
import { Title } from '../components/shared';

function Draw() {
  const [lines, setLines] = useState([]);

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
