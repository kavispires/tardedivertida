// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useBooleanDictionary, useMock } from 'hooks';
// Utils
import { mockDreamSelection } from './utils/mock';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { DreamSelectionExtendedRules, DreamSelectionRules } from './components/RulesBlobs';
import { SelectTable } from './components/SelectTable';

const validateSelectedCards = (v: BooleanDictionary) => {
  return Object.keys(v).length < 10;
};

type StepDreamsSelectionProps = {
  table: GImageCard[];
  word: GWord;
  onSubmitCards: GenericFunction;
  currentRound: number;
};

export function StepDreamsSelection({ table, word, onSubmitCards, currentRound }: StepDreamsSelectionProps) {
  const [selectedCards, onSelectCard] = useBooleanDictionary({}, validateSelectedCards);

  const selectedCount = Object.keys(selectedCards).length;

  useMock(() => {
    onSubmitCards({ cardsIds: mockDreamSelection(table) });
  }, []);

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Visite Sonhos" en="Visit Dreams" />
      </Title>
      <Card randomColor>{word.text}</Card>
      <DreamSelectionRules contained />

      <PopoverRule content={<DreamSelectionExtendedRules />} />

      <Space className="space-container" align="center">
        <Button
          type="primary"
          size="large"
          disabled={selectedCount < 1 || selectedCount > 10}
          onClick={() => onSubmitCards({ cardsIds: Object.keys(selectedCards) })}
        >
          <Translate pt={`Visitar ${selectedCount} sonhos`} en={`Visit ${selectedCount} dreams`} />
        </Button>
      </Space>
      <SelectTable table={table} onSelectCard={onSelectCard} selectedCards={selectedCards} />
    </Step>
  );
}
