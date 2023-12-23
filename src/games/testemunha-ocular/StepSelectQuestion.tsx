// Utils
import { LETTERS } from 'utils/constants';
// Components

import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Space } from 'antd';
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Card } from 'components/cards';

type StepSelectQuestionProps = {
  questions: TQuestion[];
  onSelectQuestion: GenericFunction;
  isLoading: boolean;
  suspects: Suspect[];
  previouslyEliminatedSuspects: string[];
  history: THistoryEntry[];
} & AnnouncementProps;

export function StepSelectQuestion({
  questions,
  onSelectQuestion,
  isLoading,
  suspects,
  previouslyEliminatedSuspects,
  history,
  announcement,
}: StepSelectQuestionProps) {
  return (
    <Step announcement={announcement}>
      <Title>
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
    </Step>
  );
}
