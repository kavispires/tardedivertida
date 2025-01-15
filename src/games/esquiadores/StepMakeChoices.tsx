// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import type { PhaseBetsState, SubmitChoicesPayload } from './utils/types';
import { TurnOrder } from 'components/players';
import { MountainIllustration } from './components/Mountain';
import { Button, Steps } from 'antd';
import { useStep } from 'hooks/useStep';
import { useMemo, useState } from 'react';
import { shuffle } from 'lodash';
import { SendButton } from 'components/buttons';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { useMock } from 'hooks/useMock';

type StepMakeChoicesProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: GameOrder;
  mountain: PhaseBetsState['mountain'];
  onSubmitChoices: (payload: SubmitChoicesPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepMakeChoices({
  announcement,
  players,
  turnOrder,
  user,
  mountain,
  onSubmitChoices,
}: StepMakeChoicesProps) {
  const { step, goToNextStep } = useStep(0);
  const [choices, setChoices] = useState<string[]>([]);

  useMock(() => {
    onSubmitChoices({
      choices: mountain.map(() => (Math.random() > 0.5 ? 'left' : 'right')),
    });
  });

  const dilemmas = useMemo(() => {
    return shuffle(mountain);
  }, [mountain]);

  const currentDilemma = dilemmas[step];
  const isLastStep = step === dilemmas.length;

  const handleChoice = (mountainEntryId: number, choice: string) => {
    const index = mountain.findIndex((entry) => entry.id === mountainEntryId);
    setChoices((prev) => {
      prev[index] = choice;
      return prev;
    });
    goToNextStep();
  };

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Responda as perguntas" en="Answer the questions" />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Responda as perguntas abaixo. Suas respostas determinará qual cabana seu esquiador irá parar
              quando descer a montanha.
              <br />A ordem aqui não é importante.
            </>
          }
          en={
            <>
              Answer the questions below. Your answers will determine which lodge your skier will stop when
              descending the mountain.
              <br />
              The order here is not important.
            </>
          }
        />
      </RuleInstruction>

      <Steps
        size="small"
        current={step}
        items={[
          {
            title: '❄',
          },
          {
            title: '❄',
          },
          {
            title: '❄',
          },
          {
            title: '❄',
          },
          {
            title: '❄',
          },
          {
            title: '❄',
          },
          {
            title: '!',
          },
        ]}
      />

      {currentDilemma && (
        <div className="ski-mountain-entry my-6">
          <div className="ski-mountain-entry__prompt">{currentDilemma.dilemma.prompt}</div>

          <MountainIllustration spriteId={currentDilemma.spriteId} width={256} />

          <div className="ski-mountain-entry__options">
            <Button block onClick={() => handleChoice(currentDilemma.id, 'left')}>
              {currentDilemma.dilemma.left}
            </Button>
            <Button block onClick={() => handleChoice(currentDilemma.id, 'right')}>
              {currentDilemma.dilemma.right}
            </Button>
          </div>
        </div>
      )}

      {isLastStep && (
        <SpaceContainer direction="vertical">
          <RuleInstruction type="event">
            <Translate
              pt="Você respondeu todas as perguntas. Clique em 'Enviar' para finalizar."
              en="You answered all questions. Click 'Send' to complete"
            />
          </RuleInstruction>
          <SendButton
            onClick={() =>
              onSubmitChoices({
                choices,
              })
            }
            size="large"
          >
            <Translate pt="Enviar" en="Send" />
          </SendButton>
        </SpaceContainer>
      )}
      <TurnOrder players={players} order={turnOrder} activePlayerId={user.id} />
    </Step>
  );
}
