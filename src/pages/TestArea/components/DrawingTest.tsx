import { useState } from 'react';
// Components
import { DrawingCanvas } from '@components/canvas/DrawingCanvas';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { Title } from '@components/text/Title';
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

      <Surface contained>
        <Translate
          pt="Desenhe um quadrado, um triângulo e um circulo no espaço abaixo"
          en="Draw a square, a triangle, and a circle in the canvas below"
        />
      </Surface>

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
