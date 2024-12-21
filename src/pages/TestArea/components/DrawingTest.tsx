import { useState } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Components
import { DrawingCanvas } from 'components/canvas';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

export function DrawingTest({ onResult, step }: TestStepProps) {
  const [lines, setLines] = useState<any>([]);

  return (
    <Space className="space-container full-width" direction="vertical">
      <Title level={2} size="small">
        <Translate pt="Desenho" en="Desenho" />
      </Title>

      <Instruction contained>
        <Translate
          pt="Desenhe um quadrado, um triângulo e um circulo no espaço abaixo"
          en="Draw a square, a triangle, and a circle in the canvas below"
        />
      </Instruction>

      <Space wrap className="space-container full-width">
        <DrawingCanvas lines={lines} setLines={setLines} showControls strokeWidth="small" />
      </Space>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          en: 'Were you able to draw without any major issues?',
          pt: 'Você conseguiu desenhar sem muitos problemas?',
        }}
      />
    </Space>
  );
}
