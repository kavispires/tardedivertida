// Ant Design Resources
import { Button } from 'antd';
// Hooks
import { useBooleanDictionary } from 'hooks';
// Components
import { ButtonContainer, Card, PopoverRule, Step, Title, Translate } from 'components';
import { DreamSelectionExtendedRules, DreamSelectionRules } from './RulesBlobs';
import { SelectTable } from './SelectTable';

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

  return (
    <Step fullWidth>
      <Title level={2}>
        <Translate pt="Visite Sonhos" en="Visit Dreams" />
      </Title>
      <Card randomColor>{word.text}</Card>
      <DreamSelectionRules contained />
      {currentRound === 1 && <DreamSelectionExtendedRules />}

      <PopoverRule content={<DreamSelectionExtendedRules />} />
      <SelectTable table={table} onSelectCard={onSelectCard} selectedCards={selectedCards} />

      <ButtonContainer>
        <Button
          type="primary"
          size="large"
          disabled={selectedCount < 1 || selectedCount > 10}
          onClick={() => onSubmitCards({ cardsIds: Object.keys(selectedCards) })}
        >
          <Translate pt={`Enviar ${selectedCount} cartas-sonho`} en={`Send ${selectedCount} dream cards`} />
        </Button>
      </ButtonContainer>
    </Step>
  );
}
