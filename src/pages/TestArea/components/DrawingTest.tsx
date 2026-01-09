import { useState } from 'react';
// Components
import { DrawingCanvas } from 'components/canvas';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

export function DrawingTest({ onResult, step }: TestStepProps) {
  const [lines, setLines] = useState<CanvasLine[]>([]);

  return (
    <SpaceContainer
      className="full-width"
      vertical
    >
      <Title
        level={2}
        size="small"
      >
        <Translate
          pt="Desenho"
          en="Desenho"
        />
      </Title>

      <Instruction contained>
        <Translate
          pt="Desenhe um quadrado, um triângulo e um circulo no espaço abaixo"
          en="Draw a square, a triangle, and a circle in the canvas below"
        />
      </Instruction>

      <SpaceContainer
        wrap
        className="full-width"
      >
        <DrawingCanvas
          lines={lines}
          setLines={setLines}
          showControls
          strokeWidth="small"
        />
      </SpaceContainer>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          en: 'Were you able to draw without any major issues?',
          pt: 'Você conseguiu desenhar sem muitos problemas?',
        }}
      />
    </SpaceContainer>
  );
}
