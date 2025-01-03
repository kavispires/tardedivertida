// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Components
import { CanvasResizer } from 'components/canvas';
import { ImageCardBack } from 'components/image-cards';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

export function ResizingTest({ onResult, step }: TestStepProps) {
  const [canvasSize] = useGlobalLocalStorage('canvasSize');

  return (
    <Space className="space-container full-width" direction="vertical">
      <Title level={2} size="small">
        <Translate pt="Redimensionador" en="Resizer" />
      </Title>

      <Instruction contained>
        <Translate
          pt="O botão no canto superior esquerdo é o botão de redimensionar. Clique nele e tente redimensionar a imagem."
          en="The button in the top left corner is the resize button. Click it and try to resize the image."
        />
      </Instruction>

      <CanvasResizer />
      <Space wrap className="space-container full-width">
        <ImageCardBack cardWidth={canvasSize ?? 50} />
      </Space>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você conseguiu redimensionar a carta sem muitos problemas?',
          en: 'Were you able to resize without any major issues?',
        }}
      />
    </Space>
  );
}
