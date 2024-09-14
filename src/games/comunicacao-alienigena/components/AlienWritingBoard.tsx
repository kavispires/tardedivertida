import { useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { DrawingCanvas } from 'components/canvas';
import { Translate } from 'components/language';
// Internal
import { ALIEN_CANVAS } from '../utils/constants';

type HumanSignBoardProps = {
  onSubmit: GenericFunction;
  disabled?: boolean;
};

export function AlienWritingBoard({ onSubmit, disabled }: HumanSignBoardProps) {
  const [lines, setLines] = useState<CanvasLine[]>([]);

  return (
    <Space className="space-container" direction="vertical">
      <DrawingCanvas
        lines={lines}
        setLines={setLines}
        width={ALIEN_CANVAS.WIDTH}
        height={ALIEN_CANVAS.HEIGHT}
        showControls
        strokeWidth="large"
        className="alien-canvas"
      />
      <Button
        type="primary"
        size="large"
        disabled={disabled || lines.length < 1}
        onClick={() => onSubmit(JSON.stringify(lines))}
      >
        <Translate pt="Enviar" en="Submit" />
      </Button>
    </Space>
  );
}
