import { useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { DrawingIcon } from 'icons/DrawingIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitDrawingAPIRequest } from './utils/api-requests';
import { SINAIS_DE_ALERTA_PHASES } from './utils/constants';
import { StepDraw } from './StepDraw';

export function PhaseDrawing({ state, players, meta, user }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);

  const [startDrawingTimer, setStartDrawingTimer] = useState(false);
  const timeLimit: number = state.timeLimit ?? 30;

  const onSubmitDrawing = useOnSubmitDrawingAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<DrawingIcon />}
      title={
        <Translate
          pt="Alerte!"
          en="Warn!"
        />
      }
      currentRound={state?.round?.current}
      buttonText={
        <Translate
          pt="Um dó, lá, si... vamos e... já!"
          en="Ready! Set! Go!"
        />
      }
      type="overlay"
      withoutTimer
      onClose={() => setStartDrawingTimer(true)}
    >
      <Instruction>
        <Translate
          pt={<>Você tem {timeLimit} segundos para ler e desenhar sua carta</>}
          en={<>You have {timeLimit} seconds to read and draw your card</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={SINAIS_DE_ALERTA_PHASES.DRAWING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          unskippable
        />

        {/* Step 1 */}
        <StepDraw
          gameLanguage={meta.language}
          user={user}
          cards={state?.cards}
          onSubmitDrawing={onSubmitDrawing}
          announcement={announcement}
          startDrawingTimer={startDrawingTimer}
          timeLimit={timeLimit}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
