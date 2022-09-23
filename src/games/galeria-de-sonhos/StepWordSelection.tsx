// Ant Design Resources
import { Space } from 'antd';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';

type StepWordSelectionProps = {
  onSubmitWord: GenericFunction;
  words: GWord[];
};

export function StepWordSelection({ onSubmitWord, words }: StepWordSelectionProps) {
  return (
    <Step fullWidth>
      <Title>
        <Translate pt="Selecione o tema da rodada" en="Select the theme for the round" />
      </Title>

      <Space className="space-container" align="center">
        {words.map((word, index) => {
          return (
            <TransparentButton key={word.id} onClick={() => onSubmitWord({ wordId: word.id })}>
              <Card header={LETTERS[index]} color="purple">
                {word.text}
              </Card>
            </TransparentButton>
          );
        })}
      </Space>
    </Step>
  );
}
