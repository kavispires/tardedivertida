import { useState } from 'react';
// Components
import { SendButton } from 'components/buttons';
import { DrawingCanvas } from 'components/canvas';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { ALIEN_CANVAS } from '../utils/constants';

type HumanSignBoardProps = {
  onSubmit: (drawing: string) => void;
  disabled?: boolean;
};

export function AlienWritingBoard({ onSubmit, disabled }: HumanSignBoardProps) {
  const [lines, setLines] = useState<CanvasLine[]>([]);

  return (
    <SpaceContainer vertical>
      <DrawingCanvas
        lines={lines}
        setLines={setLines}
        width={ALIEN_CANVAS.WIDTH}
        height={ALIEN_CANVAS.HEIGHT}
        showControls
        strokeWidth="large"
        className="alien-canvas"
      />
      <SendButton
        size="large"
        disabled={disabled || lines.length < 1}
        onClick={() => onSubmit(JSON.stringify(lines))}
      >
        <Translate
          pt="Enviar"
          en="Submit"
        />
      </SendButton>
    </SpaceContainer>
  );
}
