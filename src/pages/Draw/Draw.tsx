import { useState } from 'react';
// Ant Design Resources
import { Layout, Space } from 'antd';
// Components
import { DrawingCanvas } from 'components/canvas';
import { Title } from 'components/text';

function Draw() {
  const [lines, setLines] = useState<any>([]);

  return (
    <Layout.Content className="container">
      <Title>Draw</Title>

      <Space wrap className="gallery">
        <DrawingCanvas lines={lines} setLines={setLines} showControls strokeWidth="small" />
      </Space>
    </Layout.Content>
  );
}

export default Draw;
