import { useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
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
import { StepDraw } from './StepDraw';

export function PhaseDrawing({ players, state, info, meta }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);
  const [startDrawingTimer, setStartDrawingTimer] = useState(false);
  const timeLimit: number = state.timeLimit;

  const onSubmitDrawing = useOnSubmitDrawingAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<DrawingIcon />}
      title={<Translate pt="Alerte!" en="Warn!" />}
      currentRound={state?.round?.current}
      buttonText={<Translate pt="Um dó, lá, si... vamos e... já!" en="Ready! Set! Go!" />}
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SINAIS_DE_ALERTA.DRAWING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          circleColor={info?.appearance?.color}
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
