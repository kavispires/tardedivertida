// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useOnSubmitAnswersAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { NOOP } from 'utils/constants';
// Components
import { StepSwitcher } from 'components/steps';
import { StepAnswering } from './StepAnswering';
import { AnsweringRules } from './components/RulesBlobs';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { WritingIcon } from 'components/icons/WritingIcon';
import { Translate } from 'components/language';

function PhaseEverybodyWrites({ state, players, info }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitAnswers = useOnSubmitAnswersAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<WritingIcon />}
      title={<Translate pt="Todos Respondem" en="Everybody Writes" />}
      onClose={NOOP}
      currentRound={state?.round?.current}
      duration={state?.round?.current < 3 ? 20 : undefined}
      type="overlay"
    >
      <AnsweringRules />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MENTE_COLETIVA.EVERYBODY_WRITES}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepAnswering
          announcement={announcement}
          currentQuestion={state.currentQuestion}
          players={players}
          roundType={state.roundType}
          onSubmitAnswers={onSubmitAnswers}
          user={user}
          pastureSize={state.pastureSize}
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseEverybodyWrites;
