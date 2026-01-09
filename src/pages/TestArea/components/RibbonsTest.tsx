import { random } from 'lodash';
import { useState } from 'react';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { TransparentButton } from 'components/buttons';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RibbonGroup } from 'components/ribbons';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

const imageId = `cnt-${random(1, 100)}`;

export function RibbonsTest({ onResult, step }: TestStepProps) {
  const [ribbons, setRibbons] = useState<string[]>(['A']);

  const onAddRibbon = () => {
    setRibbons([...ribbons, LETTERS[ribbons.length]]);
  };

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
          pt="Bandeirinhas e Seleções"
          en="Ribbons and Selections"
        />
      </Title>

      <Instruction contained>
        <Translate
          pt="Em vários de jogos de achar os pares, você verá bandeirinhas no canto de uma carta indicando que você selecionou a carta. Clique nas cartas abaixo para adicionar bandeirinhas."
          en="In many games you will have to pair cards and images, you will see a ribbon on the corner of the card you selected. Click on the cards below to add ribbons"
        />
      </Instruction>

      <SpaceContainer
        wrap
        className="full-width"
        vertical
      >
        <TransparentButton
          onClick={onAddRibbon}
          style={{ position: 'relative' }}
        >
          <RibbonGroup labels={ribbons} />
          <ImageCard
            cardId={imageId}
            preview={false}
          />
        </TransparentButton>
      </SpaceContainer>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você conseguiu adicionar uma bandeirinha?',
          en: 'Are you able to add a ribbon?',
        }}
      />
    </SpaceContainer>
  );
}
