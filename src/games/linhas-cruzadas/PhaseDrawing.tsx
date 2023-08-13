// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitDrawingAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { DRAWING_TIME_IN_SECONDS } from './utils/constants';
// Icons
import { DrawingIcon } from 'icons/DrawingIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TurnOrder } from 'components/players';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { StepSwitcher } from 'components/steps';
import { StepTimedDrawing } from './StepTimedDrawing';
import { TimeHighlight } from 'components/metrics/TimeHighlight';

function PhaseDrawing({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitDrawing = useOnSubmitDrawingAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.DRAWING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<DrawingIcon />}
          title={<Translate pt="Desenhe" en="Draw" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText={<Translate pt="Um dó, lá, si... vamos e... já!" en="Ready! Set! Go!" />}
          withoutTimer
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Você receberá uma carta.
                  <br />
                  Desenhe-a da melhor maneira possível, você tem{' '}
                  <TimeHighlight>{DRAWING_TIME_IN_SECONDS}</TimeHighlight> segundos.
                </>
              }
              en={
                <>
                  You will receive a card.
                  <br />
                  Draw it the best way possible, you have{' '}
                  <TimeHighlight>{DRAWING_TIME_IN_SECONDS}</TimeHighlight> seconds.
                </>
              }
            />

            <TurnOrder
              title={<Translate pt="Ordem dos Álbuns" en="Albums' Order" />}
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
