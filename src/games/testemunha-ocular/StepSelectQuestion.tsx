// Types
import type { SuspectCard } from 'types/tdr';
// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Outcome, Question, SelectQuestionPayload, Status, THistoryEntry } from './utils/types';
import { OUTCOME } from './utils/constants';
import { mockQuestionSelection } from './utils/mock';
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Summary } from './components/Summary';

type StepSelectQuestionProps = {
  questions: Question[];
  onSelectQuestion: (payload: SelectQuestionPayload) => void;
  isLoading: boolean;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: UID[];
  previouslyEliminatedSuspects: string[];
  history: THistoryEntry[];
  status: Status;
  outcome: Outcome;
} & Pick<StepProps, 'announcement'>;

export function StepSelectQuestion({
  questions,
  onSelectQuestion,
  isLoading,
  suspectsDict,
  suspectsIds,
  previouslyEliminatedSuspects,
  history,
  announcement,
  status,
  outcome,
}: StepSelectQuestionProps) {
  useMock(
    () => {
      onSelectQuestion({ questionId: mockQuestionSelection(questions) });
    },
    [questions],
    7,
  );

  return (
    <Step announcement={announcement}>
      <StepTitle>
        {outcome === OUTCOME.FINAL_SHOWDOWN ? (
          <Translate
            pt="Escolha a pergunta final!"
            en="Choose the final question!"
          />
        ) : (
          <Translate
            pt={<>Escolha uma pergunta</>}
            en={<>Choose a question</>}
          />
        )}
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt="A testemunha responderá a pergunta sobre o  sobre criminoso. A pergunta que você não escolher será descartada."
          en="The witness will answer the question about the perpetrator. The unchosen question will be discarded."
        />
      </RuleInstruction>

      <SpaceContainer
        align="center"
        wrap
      >
        {questions.map(({ question, id, level }, index) => {
          return (
            <TransparentButton
              key={id}
              onClick={() => onSelectQuestion({ questionId: id })}
              disabled={isLoading}
            >
              <Card
                header={LETTERS[index]}
                color={['blue', 'teal', 'purple', 'gray'][index % 4]}
                className="t-card"
                footer={Array(level).fill('•').join('')}
              >
                {question}
              </Card>
            </TransparentButton>
          );
        })}
      </SpaceContainer>

      <Suspects
        suspectsDict={suspectsDict}
        suspectsIds={suspectsIds}
        eliminatedSuspects={previouslyEliminatedSuspects}
      />

      {history.length > 0 && (
        <QuestionsHistory
          history={history}
          suspectsDict={suspectsDict}
        />
      )}

      {status && <Summary status={status} />}
    </Step>
  );
}
