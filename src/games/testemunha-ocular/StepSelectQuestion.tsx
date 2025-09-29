// Types
import type { SuspectCard } from 'types/tdr';
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
import type { Question, SelectQuestionPayload, Status, THistoryEntry } from './utils/types';
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Summary } from './components/Summary';

type StepSelectQuestionProps = {
  questions: Question[];
  onSelectQuestion: (payload: SelectQuestionPayload) => void;
  isLoading: boolean;
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: CardId[];
  previouslyEliminatedSuspects: string[];
  history: THistoryEntry[];
  status: Status;
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
}: StepSelectQuestionProps) {
  return (
    <Step announcement={announcement}>
      <StepTitle>
        <Translate pt="Selecione uma pergunta" en="Select a question" />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt="A testemunha responderá a pergunta sobre o  sobre criminoso. A pergunta que você não escolher será descartada."
          en="The witness will answer the question about the perpetrator. The unchosen question will be discarded."
        />
      </RuleInstruction>

      <SpaceContainer align="center">
        {questions.map(({ question, id }, index) => {
          return (
            <TransparentButton
              key={id}
              onClick={() => onSelectQuestion({ questionId: id })}
              disabled={isLoading}
            >
              <Card header={LETTERS[index]} randomColor className="t-card">
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

      {history.length > 0 && <QuestionsHistory history={history} suspectsDict={suspectsDict} />}

      {status && <Summary status={status} />}
    </Step>
  );
}
