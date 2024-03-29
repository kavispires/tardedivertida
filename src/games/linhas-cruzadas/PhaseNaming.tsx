// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { WriteIdeaIcon } from 'icons/WriteIdeaIcon';
// Components
import { TurnOrder } from 'components/players';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { StepSwitcher } from 'components/steps';
import { StepNameDrawing } from './StepNameDrawing';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

export function PhaseNaming({ players, state, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitGuess = useOnSubmitGuessAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LINHAS_CRUZADAS.NAMING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<WriteIdeaIcon />}
          title={<Translate pt="O que é isso?" en="What is it?" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <Instruction>
            <Translate pt="Tente adivinhar o que é a obra" en="Try to guess what the artwork is" />

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
        <StepNameDrawing
          currentPrompt={user.currentPrompt}
          onSubmitGuess={onSubmitGuess}
          players={players}
          user={user}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
