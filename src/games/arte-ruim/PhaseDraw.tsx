import { useState } from 'react';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitDrawingAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepDraw } from './StepDraw';
import { PaintingIcon } from 'components/icons/PaintingIcon';
import { DrawInstruction } from './components/TextBlobs';

function PhaseDraw({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);
  const [startDrawingTimer, setStartDrawingTimer] = useState(false);

  const onSubmitDrawing = useOnSubmitDrawingAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<PaintingIcon />}
      title={<Translate pt="Desenhe!" en="Draw!" />}
      buttonText={<Translate pt="Um dó, lá, si... vamos ir... já!" en="Ready! Set! Go!" />}
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
        conditions={[!user.isReady, !user.isReady]}
        players={players}
        waitingRoomInstruction={
          <Translate
            pt="Vamos aguardar enquanto os outros jogadores terminam seus desenhos!"
            en="Please wait while other players finish their artwork!"
          />
        }
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          circleColor={info?.appearance?.color}
        >
          <Instruction contained>
            <Translate
              pt={`Essa rodada usará cartas de nível ${state?.level || '?'}`}
              en={`This round uses cards of level ${state?.level || '?'}`}
            />
            {state.level === 4 && (
              <Instruction contained>
                <Translate
                  pt="No nível 4, as cartas tem um ou dois temas comuns, então preste atenção nos detalhes"
                  en="On level 4, the cards have one or two common themes, so pay attention to details"
                />
              </Instruction>
            )}
            {state.level === 5 && (
              <Instruction contained>
                <Translate
                  pt="No nível 5, só existem duas cartas para todos"
                  en="On level 5, players draw one of two things only"
                />
              </Instruction>
            )}
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
