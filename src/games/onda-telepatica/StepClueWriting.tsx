import { useState } from 'react';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
// Types
import { SpectrumCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockHint } from './utils/mock';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Dial } from './components/Dial';
import { ClueWritingRules } from './components/RulesBlobs';
import { TargetSideHighlight, WavelengthHighlight } from './components/Highlights';

type StepClueWritingProps = {
  currentCategories: SpectrumCard[];
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
  const { translate } = useLanguage();
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
      <Title white>
        <Translate pt="Escreva sua dica" en="Write your clue" />
      </Title>
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              O ponteiro está no <WavelengthHighlight>{Math.abs(target)}</WavelengthHighlight>{' '}
              <TargetSideHighlight target={target} card={card} />. <strong>Escreva</strong> uma dica que ajude
              os outros jogadores a escolher exatamente esse número!
              <br />
              Revise as regras de quais dicas são válidas clicando no Ícone de Livrinho.
            </>
          }
          en={
            <>
              The needle is pointing at <WavelengthHighlight>{Math.abs(target)}</WavelengthHighlight>{' '}
              <TargetSideHighlight target={target} card={card} />. <strong>Write</strong> a clue that will
              help the other players to choose this exact number!
              <br />
              Revise the rules for clue writing by clicking on the top left Book Icon.
            </>
          }
        />
        <ClueWritingRules />
      </RuleInstruction>
      <Dial target={target} card={card!} showTarget />
      <Space className="space-container" align="center">
        <Input
          onChange={onChangeInput}
          onPressEnter={onSubmitClue}
          placeholder={translate('Escreva aqui', 'Write here')}
          size="large"
        />
        <Button type="primary" onClick={onSubmitClue} disabled={isLoading} loading={isLoading} size="large">
          <Translate pt="Enviar" en="Send" />
        </Button>
      </Space>
    </Step>
  );
}
