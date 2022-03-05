import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage } from 'hooks';
import { useOnSubmitDrawingAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { DRAWING_TIME_IN_SECONDS } from './constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  Translate,
  TurnOrder,
} from 'components';
import { StepTimedDrawing } from './StepTimedDrawing';

function PhaseDrawing({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  const onSubmitDrawing = useOnSubmitDrawingAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.DRAWING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="drawing"
          title={translate('Desenhe', 'Draw')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          buttonText={translate('Um dó, lá, si... vamos ir... já!', 'Ready! Set! Go!')}
          withoutTimer
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Você receberá uma expressão.
                  <br />
                  Desenhe-a da melhor maneira possível, você tem {DRAWING_TIME_IN_SECONDS} segundos.
                </>
              }
              en={
                <>
                  You will receive an expression.
                  <br />
                  Draw it the best way possible, you have {DRAWING_TIME_IN_SECONDS} seconds.
                </>
              }
            />

            <TurnOrder
              players={players}
              order={state.gameOrder}
              className="l-turn-order"
              activePlayerId={user.currentPrompt?.id}
              reorderByUser={user.id}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepTimedDrawing
          currentPrompt={user.currentPrompt}
          onSubmitDrawing={onSubmitDrawing}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseDrawing;
