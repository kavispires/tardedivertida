// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSelectQuestionAPIRequest } from './utils/api-requests';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ViewOr } from 'components/views';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepQuestionWaiting } from './StepQuestionWaiting';
import { StepSelectQuestion } from './StepSelectQuestion';
import { InvestigationIcon } from 'components/icons/InvestigationIcon';

function PhaseQuestionSelection({ state, players, info }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step, goToNextStep } = useStep(0);
  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);
  const [questioner, isUserTheQuestioner] = useWhichPlayerIsThe('questionerId', state, players);
  const onSelectQuestion = useOnSelectQuestionAPIRequest();

  const roundsLeft = (state?.round?.total ?? 0) - (state?.round?.current ?? 0) + 1 || 11;

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.QUESTION_SELECTION}
      className="t-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<InvestigationIcon />}
          title={<Translate pt="Seleção da Pergunta" en="Question Selection" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Agora que encontramos nossa testemunha (<AvatarName player={witness} />) é hora de
                  questioná-la.
                  <br />
                  Só temos tempo para {roundsLeft} perguntas. Portanto, <AvatarName player={questioner} />,
                  escolha a pergunta certa.
                </>
              }
              en={
                <>
                  Now that we have a Witness (<AvatarName player={witness} />
                  ), it's time to choose the question to ask them.
                  <br />
                  We can only have time for {roundsLeft} questions. So <AvatarName player={questioner} />,
                  choose a question
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewOr orCondition={isUserTheQuestioner}>
          <StepSelectQuestion
            isLoading={isLoading}
            onSelectQuestion={onSelectQuestion}
            previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
            questions={state.questions}
            suspects={state.suspects}
            history={state.history}
          />

          <StepQuestionWaiting
            isUserTheWitness={isUserTheWitness}
            perpetrator={state.perpetrator}
            previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
            questioner={questioner}
            suspects={state.suspects}
            history={state.history}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseQuestionSelection;
