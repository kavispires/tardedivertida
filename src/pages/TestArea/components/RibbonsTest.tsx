import { useState } from 'react';
import { random } from 'lodash';
// Ant Design Resources
import { Space } from 'antd';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { DecisionButtons } from './DecisionButtons';
import { TestStepProps } from '../TestArea';
import { TransparentButton } from 'components/buttons';
import { ImageCard } from 'components/image-cards';
import { RibbonGroup } from 'components/ribbons';

const imageId = `cnt-${random(1, 100)}`;

export function RibbonsTest({ onResult, step }: TestStepProps) {
  const [ribbons, setRibbons] = useState<string[]>(['A']);

  const onAddRibbon = () => {
    setRibbons([...ribbons, LETTERS[ribbons.length]]);
  };

  return (
    <Space className="space-container full-width" direction="vertical">
      <Title level={2} size="small">
        <Translate pt="Bandeirinhas e Seleções" en="Ribbons and Selections" />
      </Title>

      <Instruction contained>
        <Translate
          pt="Em vários de jogos de achar os pares, você verá bandeirinhas no canto de uma carta indicando que você selecionou a carta. Clique nas cartas abaixo para adicionar bandeirinhas."
          en="In many games you will have to pair cards and images, you will see a ribbon on the corner of the card you selected. Click on the cards below to add ribbons"
        />
      </Instruction>

      <Space wrap className="space-container full-width" direction="vertical">
        <TransparentButton onClick={onAddRibbon} style={{ position: 'relative' }}>
          <RibbonGroup labels={ribbons} />
          <ImageCard imageId={imageId} preview={false} />
        </TransparentButton>
      </Space>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você conseguiu adicionar uma bandeirinha?',
          en: 'Are you able to add a ribbon?',
        }}
      />
    </Space>
  );
}
