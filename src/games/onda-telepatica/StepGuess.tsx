import { useState } from 'react';
// Design Resources
import { Button, Slider } from 'antd';
// Hooks
import { useLoading } from '../../hooks';
// Components
import { ButtonContainer, Instruction, Step, Title, Translate } from '../../components';
import { Dial } from './Dial';

type PromptProps = {
  currentCategory: OCurrentCategory;
};

function Prompt({ currentCategory }: PromptProps) {
  return (
    <Instruction contained>
      <Translate pt="Qual número melhor indica" en="What number best translates" />
      <span className="o-dial-guess-selection__clue">{currentCategory.clue}</span>{' '}
      <Translate pt="na escala" en="on the scale" />{' '}
      <strong>
        {currentCategory.left}-{currentCategory.right}
      </strong>
      ?
      <br />
      <Translate
        pt="Clique no número ou use a barra, então aperte Enviar."
        en="Click on the number or use the slider, then press Send."
      />
    </Instruction>
  );
}

type StepGuessProps = {
  currentCategory: OCurrentCategory;
  onSendGuess: GenericFunction;
};

export function StepGuess({ currentCategory, onSendGuess }: StepGuessProps) {
  const [isLoading] = useLoading();
  const [needle, setNeedle] = useState(0);

  return (
    <Step className="o-dial-guess-selection">
      <Title>
        <Translate pt="Hora de brilhar telepaticamente!" en="Time to shine telepathically!" />
      </Title>
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
      <ButtonContainer>
        <Button
          type="primary"
          onClick={() => onSendGuess({ guess: needle })}
          size="large"
          disabled={isLoading}
        >
          <Translate pt="Enviar" en="Send" />: {needle < 0 ? currentCategory.left : currentCategory.right} »{' '}
          {Math.abs(needle)}
        </Button>
      </ButtonContainer>
    </Step>
  );
}