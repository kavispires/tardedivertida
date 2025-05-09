// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { InvestigationIcon } from 'icons/InvestigationIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSelectQuestionAPIRequest } from './utils/api-requests';
import { TESTEMUNHA_OCULAR_PHASES } from './utils/constants';
import { StepQuestionWaiting } from './StepQuestionWaiting';
import { StepSelectQuestion } from './StepSelectQuestion';

function PhaseQuestionSelection({ state, players }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step } = useStep(0);
  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);
  const [questioner, isUserTheQuestioner] = useWhichPlayerIsThe('questionerId', state, players);
  const onSelectQuestion = useOnSelectQuestionAPIRequest();

  const roundsLeft = (state?.round?.total ?? 0) - (state?.round?.current ?? 0) + 1 || 11;

  const announcement = (
    <PhaseAnnouncement
      icon={<InvestigationIcon />}
      title={<Translate pt="Seleção da Pergunta" en="Question Selection" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Agora que encontramos nossa testemunha (<AvatarName player={witness} />) é hora de questioná-la.
              <br />
              Só temos tempo para <TimeHighlight>{roundsLeft}</TimeHighlight> perguntas. Portanto,{' '}
              <AvatarName player={questioner} />, escolha a pergunta certa.
            </>
          }
          en={
            <>
              Now that we have a Witness (<AvatarName player={witness} />
              ), it's time to choose the question to ask them.
              <br />
              We can only have time for <TimeHighlight>{roundsLeft}</TimeHighlight> questions. So{' '}
              <AvatarName player={questioner} />, choose a question
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TESTEMUNHA_OCULAR_PHASES.QUESTION_SELECTION}
      className="t-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={isUserTheQuestioner}>
          <StepSelectQuestion
            isLoading={isLoading}
            onSelectQuestion={onSelectQuestion}
            previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
            questions={state.questions}
            suspects={state.suspects}
            history={state.history}
            announcement={announcement}
            status={state.status}
          />

          <StepQuestionWaiting
            isUserTheWitness={isUserTheWitness}
            perpetrator={state.perpetrator}
            previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
            questioner={questioner}
            suspects={state.suspects}
            history={state.history}
            announcement={announcement}
            status={state.status}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseQuestionSelection;
