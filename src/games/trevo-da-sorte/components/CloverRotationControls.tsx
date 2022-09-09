import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';

type CloverRotationControlsProps = {
  onRotateClover: (direction: -1 | 1) => void;
};

export function CloverRotationControls({ onRotateClover }: CloverRotationControlsProps) {
  return (
    <div className="controls space-container center">
      <Button icon={<RotateLeftOutlined />} onClick={() => onRotateClover(-1)} />
      <Button icon={<RotateRightOutlined />} onClick={() => onRotateClover(1)} />
    </div>
  );
}
