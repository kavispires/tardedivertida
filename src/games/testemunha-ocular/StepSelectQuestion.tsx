// Utils
import { LETTERS } from '../../utils/constants';
// Components
import { ButtonContainer, Card, Instruction, Step, Title, Translate } from '../../components';
import { Suspects } from './Suspects';

type StepSelectQuestionProps = {
  questions: Question[];
  onSelectQuestion: GenericFunction;
  isLoading: boolean;
  suspects: Suspect[];
  previouslyEliminatedSuspects: string[];
};

export function StepSelectQuestion({
  questions,
  onSelectQuestion,
  isLoading,
  suspects,
  previouslyEliminatedSuspects,
}: StepSelectQuestionProps) {
  return (
    <Step>
      <Title>
        <Translate pt="Selecione uma pergunta" en="Select a question" />
      </Title>
      <Instruction contained>
        <Translate
          pt="A testemunha responderá a pergunta sobre o  sobre criminoso. A pergunta que você não escolher será descartada."
          en="The witness will answer the question about the perpetrator. The unchosen question will be discarded."
        />{' '}
      </Instruction>

      <ButtonContainer className="t-select-question">
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
      </ButtonContainer>

      <Suspects suspects={suspects} eliminatedSuspects={previouslyEliminatedSuspects} />
    </Step>
  );
}
