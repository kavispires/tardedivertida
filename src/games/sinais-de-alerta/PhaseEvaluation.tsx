// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { EvaluateIcon } from 'icons/EvaluateIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { StepEvaluate } from './StepEvaluate';
// import { EvaluationRules } from './components/TextBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
// import { EvaluatedDrawings } from './components/EvaluatedDrawings';
import { Translate } from 'components/language';
import { ViewIf } from 'components/views';
import { EvaluationRules } from './components/RulesBlobs';

export function PhaseEvaluation({ players, state, info, meta }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<EvaluateIcon />}
      title={<Translate pt="Adivinhação" en="Match the cards" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <EvaluationRules />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SINAIS_DE_ALERTA.EVALUATION}>
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
