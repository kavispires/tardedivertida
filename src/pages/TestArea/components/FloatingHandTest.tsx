import { random } from 'lodash';
// Components
import { FloatingHand } from 'components/general/FloatingHand';
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';


const hand = Array(8)
  .fill(0)
  .map((_, i) => `td-d${random(1, 10)}-${random(1, 168)}`);

export function FloatingHandTest({ onResult, step }: TestStepProps) {
  return (
    <SpaceContainer className="full-width" vertical>
      <Title level={2} size="small">
        <Translate pt="Mão de Cartas" en="Hand of Cards" />
      </Title>
      <Instruction contained>
        <Translate
          pt="Durante alguns jogos, você terá uma mão de cartas. Em um computador, as cartas são minimizadas na parte inferior e você pode arrastar o mouse para vê-las. Em um dispositivo móvel, elas são exibidas diretamente na parte inferior da tela"
          en="During some games, you will have a hand of cards. In a computer, you may hover the minimized cards at the bottom to see them. In a mobile device, they are displayed directly at the bottom of the screen."
        />
      </Instruction>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você consegue ver 8 cartas?',
          en: 'Are you able to see 8 cards?',
        }}
      />

      <FloatingHand>
        <ImageCardHand sizeRatio={8} hand={hand} />
      </FloatingHand>
    </SpaceContainer>
  );
}
