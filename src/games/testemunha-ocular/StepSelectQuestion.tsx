// Ant Design Resources
import { Space } from 'antd';
// Types
import type { SuspectCard } from 'types/tdr';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import { Question, Status, THistoryEntry } from './utils/types';
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Summary } from './components/Summary';

type StepSelectQuestionProps = {
  questions: Question[];
  onSelectQuestion: GenericFunction;
  isLoading: boolean;
  suspects: SuspectCard[];
  previouslyEliminatedSuspects: string[];
  history: THistoryEntry[];
  status: Status;
} & Pick<StepProps, 'announcement'>;

export function StepSelectQuestion({
  questions,
  onSelectQuestion,
  isLoading,
  suspects,
  previouslyEliminatedSuspects,
  history,
  announcement,
  status,
}: StepSelectQuestionProps) {
  return (
    <Step announcement={announcement}>
      <Title size="medium">
        <Translate pt="Selecione uma pergunta" en="Select a question" />
      </Title>
      <RuleInstruction type="action">
        <Translate
          pt="A testemunha responderá a pergunta sobre o  sobre criminoso. A pergunta que você não escolher será descartada."
          en="The witness will answer the question about the perpetrator. The unchosen question will be discarded."
        />{' '}
      </RuleInstruction>

      <Space className="space-container" align="center">
        {questions.map(({ question, id }, index) => {
          return (
            <button
              key={id}
              className="t-select-question__button"
              onClick={() => onSelectQuestion({ questionId: id })}
              disabled={isLoading}
            >
              <Card header={LETTERS[index]} randomColor className="t-card">
                {question}
              </Card>
            </button>
          );
        })}
      </Space>

      <Suspects suspects={suspects} eliminatedSuspects={previouslyEliminatedSuspects} />

      {history.length > 0 && <QuestionsHistory history={history} />}

      {status && <Summary status={status} />}
    </Step>
  );
}
