// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { EvaluateIcon } from 'icons/EvaluateIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { ViewIf } from 'components/views';
// Internal
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
import { SINAIS_DE_ALERTA_PHASES } from './utils/constants';
import { EvaluationRules } from './components/RulesBlobs';
import { StepEvaluate } from './StepEvaluate';

export function PhaseEvaluation({ state, players, meta, user }: PhaseProps) {
  const { step, setStep } = useStep(0);

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<EvaluateIcon />}
      title={<Translate pt="Adivinhação" en="Match the cards" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={state.round.current < 2 ? 12 : undefined}
    >
      <EvaluationRules />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={SINAIS_DE_ALERTA_PHASES.EVALUATION}>
      <StepSwitcher step={step} players={players}>
        {/*Step 0 */}
        <ViewIf condition={state.drawings && user.id}>
          <StepEvaluate
            announcement={announcement}
            gameLanguage={meta.language}
            user={user}
            players={players}
            onSubmitGuesses={onSubmitGuesses}
            cards={state.cards}
            drawings={state.drawings}
            subjectsIds={state.subjectsIds}
            descriptorsIds={state.descriptorsIds}
          />
        </ViewIf>
      </StepSwitcher>
    </PhaseContainer>
  );
}
