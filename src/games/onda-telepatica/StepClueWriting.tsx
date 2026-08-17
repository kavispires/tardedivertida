import { useState } from 'react';
// Ant Design Resources
import { Input } from 'antd';
// Types
import type { SpectrumCardData } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { Step } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import { mockHint } from './utils/mock';
import type { SubmitCluePayload } from './utils/types';
import { Dial } from './components/Dial';
import { RulesEn, RulesPt } from './components/RulesBlobs';
import { TargetSideHighlight, WavelengthHighlight } from './components/Highlights';

type StepClueWritingProps = {
  currentCategories: SpectrumCardData[];
  currentCategoryId?: string;
  target: number;
  onSendClue: (payload: SubmitCluePayload) => void;
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
        <Translate
          pt="Escreva sua dica"
          en="Write your clue"
        />
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          pt="O ponteiro está no {wavelength} {side}.<br/><strong>Escreva</strong> uma dica que ajude os outros jogadores a escolher exatamente esse número!"
          en="The needle is pointing at {wavelength} {side}.<br/><strong>Write</strong> a clue that will help the other players to choose this exact number!"
          values={{
            wavelength: <WavelengthHighlight>{Math.abs(target)}</WavelengthHighlight>,
            side: (
              <TargetSideHighlight
                target={target}
                card={card}
              />
            ),
          }}
        />
      </RuleInstruction>

      {!!card && (
        <Dial
          target={target}
          card={card}
          showTarget
        />
      )}
      <SpaceFloat>
        <Input
          onChange={onChangeInput}
          onPressEnter={onSubmitClue}
          placeholder={translate({ pt: 'Escreva aqui', en: 'Write here' })}
          size="large"
        />
        <SendButton
          onClick={onSubmitClue}
          disabled={isLoading}
          loading={isLoading}
          size="large"
        >
          <Translate
            pt="Enviar"
            en="Send"
          />
        </SendButton>
      </SpaceFloat>

      <RuleInstruction type="rule">{language === 'pt' ? <RulesPt /> : <RulesEn />}</RuleInstruction>
    </Step>
  );
}
