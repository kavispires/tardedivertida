import { useState } from 'react';
// Ant Design Resources
import { Button, Slider, Space } from 'antd';
// Hooks
import { useLoading, useMock } from 'hooks';
// Utils
import { mockGuess } from './utils/mock';
// Components
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Dial } from './components/Dial';

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
        pt="Clique no número ou use a barra abaixo para alinhar o ponteiro na sua resposta, então aperte Enviar."
        en="Click on the number or use the slider below to position the pointer on your guess, then press Send."
      />
    </Instruction>
  );
}

type StepGuessProps = {
  currentCategory: OCurrentCategory;
  onSendGuess: GenericFunction;
  players: GamePlayers;
};

export function StepGuess({ currentCategory, onSendGuess, players }: StepGuessProps) {
  const { isLoading } = useLoading();
  const [needle, setNeedle] = useState(0);

  useMock(() => {
    onSendGuess({ guess: mockGuess(currentCategory.target ?? 0) });
  }, []);

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
      <Space className="space-container" align="center">
        <Button
          type="primary"
          onClick={() => onSendGuess({ guess: needle })}
          size="large"
          disabled={isLoading}
        >
          <Translate pt="Enviar" en="Send" />: {needle < 0 ? currentCategory.left : currentCategory.right} »{' '}
          {Math.abs(needle)}
        </Button>
      </Space>

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
