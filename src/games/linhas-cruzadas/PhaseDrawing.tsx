// State & Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
import { useOnSubmitDrawingAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { DRAWING_TIME_IN_SECONDS } from './constants';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TurnOrder } from 'components/players';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { StepSwitcher } from 'components/steps';

import { StepTimedDrawing } from './StepTimedDrawing';

function PhaseDrawing({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const { translate } = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  const onSubmitDrawing = useOnSubmitDrawingAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.DRAWING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="drawing"
          title={translate('Desenhe', 'Draw')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText={translate('Um dó, lá, si... vamos ir... já!', 'Ready! Set! Go!')}
          withoutTimer
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Você receberá uma carta.
                  <br />
                  Desenhe-a da melhor maneira possível, você tem {DRAWING_TIME_IN_SECONDS} segundos.
                </>
              }
              en={
                <>
                  You will receive an card.
                  <br />
                  Draw it the best way possible, you have {DRAWING_TIME_IN_SECONDS} seconds.
                </>
              }
            />

            <TurnOrder
              title={translate('Ordem dos Álbuns', "Albums' Order")}
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
