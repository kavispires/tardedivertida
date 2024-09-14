// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { WriteIdeaIcon } from 'icons/WriteIdeaIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TurnOrder } from 'components/players';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
import { StepNameDrawing } from './StepNameDrawing';

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
