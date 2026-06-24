import { useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { PaintingIcon } from '@icons/PaintingIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitDrawingAPIRequest } from './utils/api-requests';
import { ARTE_RUIM_PHASES } from './utils/constants';
import type { PhaseDrawState } from './utils/types';
import { DrawInstruction } from './components/TextBlobs';
import { LevelInstruction } from './components/LevelInstruction';
import { StepDraw } from './StepDraw';

function PhaseDraw({ players, state, user }: PhaseProps<PhaseDrawState>) {
  const { step, goToNextStep, setStep } = useStep(0);
  const [startDrawingTimer, setStartDrawingTimer] = useState(false);

  const onSubmitDrawing = useOnSubmitDrawingAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<PaintingIcon />}
      title={
        <Translate
          pt="Desenhe!"
          en="Draw!"
        />
      }
      buttonText={
        <Translate
          pt="Um dó, lá, si... vamos e... já!"
          en="Ready! Set! Go!"
        />
      }
      onClose={() => setStartDrawingTimer(true)}
      currentRound={state?.round?.current}
      withoutTimer
      type="overlay"
    >
      <DrawInstruction />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ARTE_RUIM_PHASES.DRAW}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          instruction: (
            <Translate
              pt="Vamos aguardar enquanto os outros jogadores terminam seus desenhos!"
              en="Please wait while other players finish their artwork!"
            />
          ),
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          unskippable
        >
          <Surface contained>
            <Translate
              pt={`Essa rodada usará cartas de nível ${state?.level || '?'}`}
              en={`This round uses cards of level ${state?.level || '?'}`}
            />
            <LevelInstruction
              level={state.level}
              levelType={state.levelType}
            />
          </Surface>
        </RoundAnnouncement>

        {/* Step 1 */}
        <StepDraw
          secretCard={user.currentCard ?? {}}
          onSubmitDrawing={onSubmitDrawing}
          announcement={announcement}
          startDrawingTimer={startDrawingTimer}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseDraw;
