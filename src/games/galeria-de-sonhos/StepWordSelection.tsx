// Utils
import { LETTERS } from 'utils/constants';
// Components
import { Card, Step, Title, Translate, TransparentButton } from 'components';
import { GeneralRules } from './RulesBlobs';
import { Space } from 'antd';

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
      <Space className="space-container" align="center">
        {words.map((word, index) => {
          return (
            <TransparentButton key={word.id} onClick={() => onSubmitWord({ wordId: word.id })}>
              <Card header={LETTERS[index]} randomColor>
                {word.text}
              </Card>
            </TransparentButton>
          );
        })}
      </Space>
    </Step>
  );
}
