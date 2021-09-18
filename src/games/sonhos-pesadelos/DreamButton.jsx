import React from 'react';
// Design Resources
import { Button } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';
// Components
import { Translate } from '../../components/shared';

function DreamButton() {
  return (
    <Button disabled className="s-dream-board-entry-dream">
      <CaretUpOutlined />
      <Translate pt="Sonho" en="Dream" />
      <CaretUpOutlined />
    </Button>
  );
}

export default DreamButton;
