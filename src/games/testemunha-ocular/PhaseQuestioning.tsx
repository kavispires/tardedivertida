// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { EyeIcon } from '@icons/EyeIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { Instruction } from '@components/text/Instruction';
// Internal
import { useOnSubmitTestimonyAPIRequest } from './utils/api-requests';
import { TESTEMUNHA_OCULAR_PHASES } from './utils/constants';
import type { PhaseQuestioningState } from './utils/types';
import { StepQuestioning } from './StepQuestioning';

export function PhaseQuestioning({ state, players }: PhaseProps<PhaseQuestioningState>) {
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
      duration={state?.round?.current === 1 ? 7 : 3}
    >
      <Instruction>
        <Translate
          pt={
            <>
              Nossa testemunha só sabe julgar por aparência.
              <br />
              <PlayerAvatarName player={witness} />, é hora de nos ajudar a pegar esse criminoso hediondo.
            </>
          }
          en={
            <>
              Our witness loves to judge the book by its cover.
              <br />
              <PlayerAvatarName player={witness} />, it's time to help us find this heinous perpetrator!
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
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepQuestioning
          suspectsDict={state.suspectsDict}
          suspectsIds={state.suspectsIds}
          previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
          perpetratorId={state.perpetratorId}
          isUserTheWitness={isUserTheWitness}
          witness={witness}
          isLoading={isLoading}
          onAnswer={onAnswer}
          question={state.question}
          history={state.history}
          announcement={announcement}
          status={state.status}
          outcome={state.outcome}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
