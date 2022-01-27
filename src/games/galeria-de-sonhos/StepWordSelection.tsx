// Utils
import { LETTERS } from '../../utils/constants';
// Components
import { ButtonContainer, Card, Step, Title, Translate } from '../../components';
import { GeneralRules } from './RulesBlobs';

type StepWordSelectionProps = {
  onSubmitWord: GenericFunction;
  words: GWord[];
};

export function StepWordSelection({ onSubmitWord, words }: StepWordSelectionProps) {
  return (
    <Step fullWidth>
      <Title>
        <Translate pt="Selecione o tema" en="Select the theme" />
      </Title>
      <GeneralRules />
      <ButtonContainer>
        {words.map((word, index) => {
          return (
            <button
              key={word.id}
              className="reset-button invisible-button"
              onClick={() => onSubmitWord({ wordId: word.id })}
            >
              <Card header={LETTERS[index]} randomColor>
                {word.text}
              </Card>
            </button>
          );
        })}
      </ButtonContainer>
    </Step>
  );
}
