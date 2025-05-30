// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { EyeIcon } from 'icons/EyeIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitTestimonyAPIRequest } from './utils/api-requests';
import { TESTEMUNHA_OCULAR_PHASES } from './utils/constants';
import { StepQuestioning } from './StepQuestioning';

function PhaseQuestioning({ state, players }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step } = useStep(0);
  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onAnswer = useOnSubmitTestimonyAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<EyeIcon />}
      title={state.question.question}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Nossa testemunha só sabe julgar por aparência.
              <br />
              <AvatarName player={witness} />, é hora de nos ajudar a pegar esse criminoso hediondo.
            </>
          }
          en={
            <>
              Our witness loves to judge the book by its cover.
              <br />
              <AvatarName player={witness} />, it's time to help us find this heinous perpetrator!
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );
  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TESTEMUNHA_OCULAR_PHASES.QUESTIONING}
      className="t-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepQuestioning
          suspects={state.suspects}
          previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
          perpetrator={state.perpetrator}
          isUserTheWitness={isUserTheWitness}
          witness={witness}
          isLoading={isLoading}
          onAnswer={onAnswer}
          question={state.question}
          history={state.history}
          announcement={announcement}
          status={state.status}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseQuestioning;
