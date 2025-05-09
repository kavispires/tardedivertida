import { useState } from 'react';
// Ant Design Resources
import { Button, Slider } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { CurrentCategory, SubmitGuessPayload } from './utils/types';
import { mockGuess } from './utils/mock';
import { Dial } from './components/Dial';

type PromptProps = {
  currentCategory: CurrentCategory;
};

function Prompt({ currentCategory }: PromptProps) {
  return (
    <RuleInstruction type="action">
      <Translate pt="Qual número melhor indica" en="What number best translates" />
      <span className="o-dial-guess-selection__clue">{currentCategory.clue}</span>{' '}
      <Translate pt="na escala" en="on the scale" />{' '}
      <strong>
        {currentCategory.left}-{currentCategory.right}
      </strong>
      ?
      <br />
      <Translate
        pt="Clique no número ou use a barra abaixo para alinhar o ponteiro na sua resposta, então aperte Enviar."
        en="Click on the number or use the slider below to position the pointer on your guess, then press Submit."
      />
    </RuleInstruction>
  );
}

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
    <Step className="o-dial-guess-selection" announcement={announcement}>
      <StepTitle>
        <Translate pt="Hora de brilhar telepaticamente!" en="Time to shine telepathically!" />
      </StepTitle>
      <Prompt currentCategory={currentCategory} />
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
      <SpaceContainer>
        <Button
          type="primary"
          onClick={() => onSendGuess({ guess: needle })}
          size="large"
          disabled={isLoading}
          loading={isLoading}
        >
          <Translate pt="Enviar" en="Submit" />: {needle < 0 ? currentCategory.left : currentCategory.right} »{' '}
          {Math.abs(needle)}
        </Button>
      </SpaceContainer>
    </Step>
  );
}
