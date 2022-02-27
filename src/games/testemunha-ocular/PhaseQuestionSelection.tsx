import { useState } from 'react';
// Hooks
import { useWhichPlayerIsThe, useLoading, useLanguage } from '../../hooks';
import { useOnSelectQuestionAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  AvatarName,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  Translate,
} from '../../components';
import { StepSelectQuestion } from './StepSelectQuestion';
import { StepQuestionWaiting } from './StepQuestionWaiting';

function PhaseQuestionSelection({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [step, setStep] = useState(0);
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
          type="investigation"
          title={translate('Seleção da Pergunta', 'Question Selection')}
          onClose={() => setStep(1)}
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
        {isUserTheQuestioner ? (
          <StepSelectQuestion
            isLoading={isLoading}
            onSelectQuestion={onSelectQuestion}
            previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
            questions={state.questions}
            suspects={state.suspects}
            history={state.history}
          />
        ) : (
          <StepQuestionWaiting
            isUserTheWitness={isUserTheWitness}
            perpetrator={state.perpetrator}
            previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
            questioner={questioner}
            suspects={state.suspects}
            history={state.history}
          />
        )}
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseQuestionSelection;
