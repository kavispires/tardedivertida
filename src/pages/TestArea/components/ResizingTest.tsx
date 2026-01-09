// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Components
import { CanvasResizer } from 'components/canvas';
import { ImageCardBack } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

export function ResizingTest({ onResult, step }: TestStepProps) {
  const [canvasSize] = useGlobalLocalStorage('canvasSize');

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
          pt="Redimensionador"
          en="Resizer"
        />
      </Title>

      <Instruction contained>
        <Translate
          pt="O botão no canto superior esquerdo é o botão de redimensionar. Clique nele e tente redimensionar a imagem."
          en="The button in the top left corner is the resize button. Click it and try to resize the image."
        />
      </Instruction>

      <CanvasResizer />
      <SpaceContainer
        wrap
        className="full-width"
      >
        <ImageCardBack cardWidth={canvasSize ?? 50} />
      </SpaceContainer>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você conseguiu redimensionar a carta sem muitos problemas?',
          en: 'Were you able to resize without any major issues?',
        }}
      />
    </SpaceContainer>
  );
}
