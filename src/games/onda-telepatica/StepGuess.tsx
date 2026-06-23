import { useState } from 'react';
// Ant Design Resources
import { Button, Slider } from 'antd';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { CurrentCategory, SubmitGuessPayload } from './utils/types';
import { mockGuess } from './utils/mock';
import { Dial } from './components/Dial';

type StepGuessProps = {
  currentCategory: CurrentCategory;
  onSendGuess: (payload: SubmitGuessPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepGuess({ currentCategory, onSendGuess, announcement }: StepGuessProps) {
  const { isLoading } = useLoading();
  const [needle, setNeedle] = useState(0);

  useMock(() => {
    onSendGuess({ guess: mockGuess(currentCategory.target ?? 0) });
  }, []);

  return (
    <Step
      className="o-dial-guess-selection"
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Hora de brilhar telepaticamente!"
          en="Time to shine telepathically!"
        />
      </StepTitle>

      <RuleInstruction
        type="action"
        className="text-center"
      >
        <Translate
          pt="Selecione o número que melhor representa"
          en="Select the number that best represents"
        />
        <br />
        <TextHighlight style={{ fontSize: '1.1em' }}>{currentCategory.clue}</TextHighlight> <br />
        <Translate
          pt="na escala"
          en="on the scale"
        />{' '}
        <br />
        <strong>
          {currentCategory.left} vs {currentCategory.right}
        </strong>
      </RuleInstruction>

      <Dial
        card={currentCategory}
        target={currentCategory.target}
        needle={needle}
        showNeedle
        showTarget={false}
        setNeedle={setNeedle}
      />

      <Slider
        style={{ width: '100%' }}
        defaultValue={0}
        min={-10}
        max={10}
        onChange={setNeedle}
        value={needle}
      />

      <RuleInstruction type="tip">
        <Translate
          en="You can click on the numbers, the card or the slider to select your guess!"
          pt="Você pode clicar nos números, na carta ou no slider para selecionar sua resposta!"
        />
      </RuleInstruction>

      <SpaceFloat className="mt-6">
        <Button
          type="primary"
          onClick={() => onSendGuess({ guess: needle })}
          size="large"
          disabled={isLoading}
          loading={isLoading}
        >
          <Translate
            pt="Enviar:"
            en="Submit:"
          />
          {needle < 0 ? currentCategory.left : currentCategory.right} » {Math.abs(needle)}
        </Button>
      </SpaceFloat>
    </Step>
  );
}
