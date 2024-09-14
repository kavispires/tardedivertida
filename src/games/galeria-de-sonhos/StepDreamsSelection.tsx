// Ant Design Resources
import { RobotOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useMock } from 'hooks/useMock';
// Components
import { FixedMenuButton } from 'components/buttons';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { TextHighlight, Title } from 'components/text';
// Internal
import type { ImageCardObj } from './utils/types';
import { mockDreamSelection } from './utils/mock';
import { BotsRules, DreamSelectionExtendedRules, DreamSelectionRules } from './components/RulesBlobs';
import { SelectTable } from './components/SelectTable';

const validateSelectedCards = (v: BooleanDictionary) => {
  return Object.keys(v).length < 10;
};

type StepDreamsSelectionProps = {
  table: ImageCardObj[];
  word: TextCard;
  onSubmitCards: GenericFunction;
  botEnabled: boolean;
  hardModeEnabled: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepDreamsSelection({
  table,
  word,
  onSubmitCards,
  botEnabled,
  announcement,
  hardModeEnabled,
}: StepDreamsSelectionProps) {
  const {
    dict: selectedCards,
    updateDict: onSelectCard,
    length: selectedCount,
  } = useBooleanDictionary({}, validateSelectedCards);

  useMock(() => {
    onSubmitCards({ cardsIds: mockDreamSelection(table, hardModeEnabled) });
  }, []);

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="medium">
        <Translate pt="Visite sonhos relacionados à " en="Visit dreams related to " />
        <TextHighlight>{word.text}</TextHighlight>
      </Title>
      <DreamSelectionRules contained hardModeEnabled={hardModeEnabled} />

      <PopoverRule content={<DreamSelectionExtendedRules />} />

      {botEnabled && (
        <FixedMenuButton
          type="popover"
          position={1}
          icon={<RobotOutlined />}
          content={<BotsRules />}
          label={<Translate pt=" Bots" en=" Bots" />}
        />
      )}

      <Space className="space-container" align="center">
        <Button
          type="primary"
          size="large"
          disabled={selectedCount < (hardModeEnabled ? 4 : 1) || selectedCount > 10}
          onClick={() => onSubmitCards({ cardsIds: Object.keys(selectedCards) })}
        >
          <Translate pt={`Visitar ${selectedCount} sonhos`} en={`Visit ${selectedCount} dreams`} />
        </Button>
      </Space>
      <SelectTable table={table} onSelectCard={onSelectCard} selectedCards={selectedCards} />
    </Step>
  );
}
