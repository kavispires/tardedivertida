import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { InvestigationIcon } from '@icons/InvestigationIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSelectQuestionAPIRequest } from './utils/api-requests';
import { OUTCOME, TESTEMUNHA_OCULAR_PHASES } from './utils/constants';
import type { PhaseQuestionSelectionState } from './utils/types';
import { StepQuestionWaiting } from './StepQuestionWaiting';
import { StepSelectQuestion } from './StepSelectQuestion';

export function PhaseQuestionSelection({ state, players }: PhaseProps<PhaseQuestionSelectionState>) {
  const { isLoading } = useLoading();
  const { step } = useStep(0);
  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);
  const [questioner, isUserTheQuestioner] = useWhichPlayerIsThe('questionerId', state, players);
  const onSelectQuestion = useOnSelectQuestionAPIRequest();

  const roundsLeft = (state?.round?.total ?? 0) - (state?.round?.current ?? 0) + 1 || 11;
  const isFinalQuestion = state.outcome === OUTCOME.FINAL_SHOWDOWN;

  const announcement = (
    <PhaseAnnouncement
      icon={<InvestigationIcon />}
      title={
        isFinalQuestion ? (
          <Translate
            pt="A Pergunta Final"
            en="Final Question"
          />
        ) : (
          <Translate
            pt="Seleção da Pergunta"
            en="Question Selection"
          />
        )
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={state?.round?.current === 1 ? 10 : 4}
    >
      <Surface>
        {isFinalQuestion ? (
          <Translate
            en="There are only two suspects left and for that we need to ask a final question. {questioner}, choose the right question."
            pt="Só faltam dois suspeitos e para isso precisamos fazer uma pergunta final. {questioner}, escolha a pergunta certa."
            values={{ questioner: <PlayerAvatarName player={questioner} /> }}
          />
        ) : (
          <Translate
            en="Now that we have our witness {witness}, it's time to question them.
            <br/>
            We only have time for {roundsLeft} questions. So {questioner}, choose the right question."
            pt="Agora que encontramos nossa testemunha {witness}, é hora de questioná-la.
            <br/>
            Só temos tempo para {roundsLeft} perguntas. Portanto, {questioner}, escolha a pergunta certa."
            values={{
              witness: <PlayerAvatarName player={witness} />,
              questioner: <PlayerAvatarName player={questioner} />,
              roundsLeft: <TimeHighlight>{roundsLeft}</TimeHighlight>,
            }}
          />
        )}
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TESTEMUNHA_OCULAR_PHASES.QUESTION_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isUserTheQuestioner}>
            <StepSelectQuestion
              isLoading={isLoading}
              onSelectQuestion={onSelectQuestion}
              previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
              questions={state.questions}
              suspectsDict={state.suspectsDict}
              suspectsIds={state.suspectsIds}
              history={state.history}
              announcement={announcement}
              status={state.status}
              outcome={state.outcome}
            />
          </ViewIf>
          <ViewIf condition={!isUserTheQuestioner}>
            <StepQuestionWaiting
              isUserTheWitness={isUserTheWitness}
              perpetratorId={state.perpetratorId}
              previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
              questioner={questioner}
              suspectsDict={state.suspectsDict}
              suspectsIds={state.suspectsIds}
              history={state.history}
              announcement={announcement}
              status={state.status}
              outcome={state.outcome}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
