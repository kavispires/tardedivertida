// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useMock } from 'hooks/useMock';
// Utils
import { mockDreamSelection } from './utils/mock';
// Components
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { TextHighlight, Title } from 'components/text';
import { BotsRules, DreamSelectionExtendedRules, DreamSelectionRules } from './components/RulesBlobs';
import { SelectTable } from './components/SelectTable';
import { RobotOutlined } from '@ant-design/icons';
import { FixedMenuButton } from 'components/buttons';

const validateSelectedCards = (v: BooleanDictionary) => {
  return Object.keys(v).length < 10;
};

type StepDreamsSelectionProps = {
  table: GImageCard[];
  word: GWord;
  onSubmitCards: GenericFunction;
  botEnabled: boolean;
} & AnnouncementProps;

export function StepDreamsSelection({
  table,
  word,
  onSubmitCards,
  botEnabled,
  announcement,
}: StepDreamsSelectionProps) {
  const [selectedCards, onSelectCard] = useBooleanDictionary({}, validateSelectedCards);

  const selectedCount = Object.keys(selectedCards).length;

  useMock(() => {
    onSubmitCards({ cardsIds: mockDreamSelection(table) });
  }, []);

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="medium">
        <Translate pt="Visite sonhos relacionados a " en="Visit dreams related to " />
        <TextHighlight>{word.text}</TextHighlight>
      </Title>
      <DreamSelectionRules contained />

      <PopoverRule content={<DreamSelectionExtendedRules />} />

      {botEnabled && (
        <FixedMenuButton
          type="popover"
          position={1}
          icon={<RobotOutlined />}
          content={<BotsRules />}
          label={<Translate pt=" Bots" en=" Bots" />}
          buttonProps={{
            type: 'default',
          }}
        />
      )}

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
