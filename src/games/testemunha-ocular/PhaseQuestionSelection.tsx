// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSelectQuestionAPIRequest } from './utils/api-requests';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { InvestigationIcon } from 'icons/InvestigationIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ViewOr } from 'components/views';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepQuestionWaiting } from './StepQuestionWaiting';
import { StepSelectQuestion } from './StepSelectQuestion';
import { TimeHighlight } from 'components/metrics/TimeHighlight';

function PhaseQuestionSelection({ state, players, info }: PhaseProps) {
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
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.QUESTION_SELECTION}
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
          />

          <StepQuestionWaiting
            isUserTheWitness={isUserTheWitness}
            perpetrator={state.perpetrator}
            previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
            questioner={questioner}
            suspects={state.suspects}
            history={state.history}
            announcement={announcement}
          />
        </ViewOr>

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseQuestionSelection;
