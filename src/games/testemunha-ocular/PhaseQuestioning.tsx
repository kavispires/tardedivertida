// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitTestimonyAPIRequest } from './utils/api-requests';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { EyeIcon } from 'icons/EyeIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { Instruction } from 'components/text';
import { StepQuestioning } from './StepQuestioning';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseQuestioning({ state, players, info }: PhaseProps) {
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
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.QUESTIONING}
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
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseQuestioning;
