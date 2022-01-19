// Design Resources
import { Button } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';
// Components
import { Translate } from '../../components';

export function NightmareButton() {
  return (
    <Button disabled className="s-dream-board-entry-nightmare">
      <CaretUpOutlined />
      <Translate pt="Pesadelo" en="Nightmare" />
      <CaretUpOutlined />
    </Button>
  );
}
