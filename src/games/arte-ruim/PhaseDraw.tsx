import { useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitDrawingAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { PaintingIcon } from 'icons/PaintingIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepDraw } from './StepDraw';
import { DrawInstruction } from './components/TextBlobs';
import { LevelInstruction } from './components/LevelInstruction';

function PhaseDraw({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);
  const [startDrawingTimer, setStartDrawingTimer] = useState(false);

  const onSubmitDrawing = useOnSubmitDrawingAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<PaintingIcon />}
      title={<Translate pt="Desenhe!" en="Draw!" />}
      buttonText={<Translate pt="Um dó, lá, si... vamos e... já!" en="Ready! Set! Go!" />}
      onClose={() => setStartDrawingTimer(true)}
      currentRound={state?.round?.current}
      withoutTimer
      type="overlay"
    >
      <DrawInstruction />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ARTE_RUIM.DRAW}>
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
          circleColor={info?.appearance?.color}
          unskippable
        >
          <Instruction contained>
            <Translate
              pt={`Essa rodada usará cartas de nível ${state?.level || '?'}`}
              en={`This round uses cards of level ${state?.level || '?'}`}
            />
            <LevelInstruction level={state.level} levelType={state.levelType} />
          </Instruction>
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
