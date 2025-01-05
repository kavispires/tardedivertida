import { useState } from 'react';
// Ant Design Resources
import { Input } from 'antd';
// Types
import type { SpectrumCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import { mockHint } from './utils/mock';
import type { SubmitCluePayload } from './utils/types';
import { Dial } from './components/Dial';
import { ClueWritingRules } from './components/RulesBlobs';
import { TargetSideHighlight, WavelengthHighlight } from './components/Highlights';

type StepClueWritingProps = {
  currentCategories: SpectrumCard[];
  currentCategoryId: string;
  target: number;
  onSendClue: (payload: SubmitCluePayload) => void;
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

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <StepTitle>
        <Translate pt="Escreva sua dica" en="Write your clue" />
      </StepTitle>
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
      {!!card && <Dial target={target} card={card} showTarget />}
      <SpaceContainer>
        <Input
          onChange={onChangeInput}
          onPressEnter={onSubmitClue}
          placeholder={translate('Escreva aqui', 'Write here')}
          size="large"
        />
        <SendButton onClick={onSubmitClue} disabled={isLoading} loading={isLoading} size="large">
          <Translate pt="Enviar" en="Send" />
        </SendButton>
      </SpaceContainer>
    </Step>
  );
}
