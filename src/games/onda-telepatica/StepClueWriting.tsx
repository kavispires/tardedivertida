import { useState } from 'react';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
// Hooks
import { useLanguage, useLoading, useMock } from 'hooks';
// Utils
import { getTargetSide } from './utils/helpers';
import { mockHint } from './utils/mock';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Dial } from './components/Dial';
import { ClueWritingRules } from './components/RulesBlobs';

type StepClueWritingProps = {
  currentCategories: OCategoryCard[];
  currentCategoryId: string;
  target: number;
  onSendClue: GenericFunction;
};

export function StepClueWriting({
  currentCategories,
  currentCategoryId,
  target,
  onSendClue,
}: StepClueWritingProps) {
  const { language, translate } = useLanguage();
  const { isLoading } = useLoading();
  const [clue, setClue] = useState('');

  const onChangeInput = (e: any) => {
    setClue(e.target.value);
  };

  const onSubmitClue = () => {
    onSendClue({ clue });
  };

  const card = currentCategories.find((c) => c.id === currentCategoryId);

  useMock(() => {
    if (card) {
      onSendClue({ clue: mockHint(card, target) });
    }
  }, []);

  return (
    <Step fullWidth>
      <Title>
        <Translate pt="Escreva sua dica" en="Write your clue" />
      </Title>
      <Instruction contained>
        <Translate
          pt={`O ponteiro está no ${Math.abs(target)} ${getTargetSide(
            target,
            card,
            language
          )}. Escreva uma dica que ajude os outros jogadores a escolher exatamente esse número! Revise as regras de quais dicas são válidas clicando no Ícone de Livrinho.`}
          en={`The needle is point at ${Math.abs(target)} ${getTargetSide(
            target,
            card,
            language
          )}. Write a clue that will help the other players to choose this exact number! Revise the rules for clue writing by clicking on the Book Icon.`}
        />
        <ClueWritingRules />
      </Instruction>
      <Dial target={target} card={card!} showTarget />
      <Space className="space-container" align="center">
        <Input
          onChange={onChangeInput}
          onPressEnter={onSubmitClue}
          placeholder={translate('Escreva aqui', 'Write here')}
        />
        <Button type="primary" onClick={onSubmitClue} disabled={isLoading}>
          <Translate pt="Enviar" en="Send" />
        </Button>
      </Space>
    </Step>
  );
}
