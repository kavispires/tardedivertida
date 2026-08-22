// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { DrawingIcon } from '@icons/DrawingIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitDrawingAPIRequest } from './utils/api-requests';
import { DRAWING_TIME_IN_SECONDS, LINHAS_CRUZADAS_PHASES } from './utils/constants';
import type { PhaseDrawingState } from './utils/types';
import { StepTimedDrawing } from './StepTimedDrawing';

export function PhaseDrawing({ state, players, user }: PhaseProps<PhaseDrawingState>) {
  const { step, goToNextStep, setStep } = useStep(0);

  const onSubmitDrawing = useOnSubmitDrawingAPIRequest(setStep);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={LINHAS_CRUZADAS_PHASES.DRAWING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<DrawingIcon />}
          title={
            <Translate
              pt="Desenhe"
              en="Draw"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText={
            <Translate
              pt="Um dó, lá, si... vamos e... já!"
              en="Ready! Set! Go!"
            />
          }
          withoutTimer
          type="block"
        >
          <Surface>
            <Translate
              pt="Você receberá uma carta.
              <br/>
              Desenhe-a da melhor maneira possível, você tem {time} segundos."
              en="You will receive a card.
              <br/>
              Draw it the best way possible, you have {time} seconds."
              values={{ time: <TimeHighlight>{DRAWING_TIME_IN_SECONDS}</TimeHighlight> }}
            />

            <PlayersTurnOrder
              title={
                <Translate
                  pt="Ordem dos Álbuns"
                  en="Albums' Order"
                />
              }
              players={players}
              order={state.gameOrder}
              className="l-turn-order"
              activePlayerId={user.currentPrompt?.id}
              reorderByUser={user.id}
            />
          </Surface>
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
