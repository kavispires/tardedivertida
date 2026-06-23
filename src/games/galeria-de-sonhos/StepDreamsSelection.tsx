// Ant Design Resources
import { RobotOutlined } from '@ant-design/icons';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useBooleanDictionary } from '@hooks/useBooleanDictionary';
import { useMock } from '@hooks/useMock';
// Components
import { FixedMenuButton } from '@components/buttons/FixedMenuButton';
import { SendButton } from '@components/buttons/SendButton';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { PopoverRule } from '@components/rules/PopoverRule';
import { Step, type StepProps } from '@components/steps/Step';
import { TextHighlight } from '@components/text/TextHighlight';
import { Title } from '@components/text/Title';
// Internal
import type { ImageCardObj, SubmitCardsPayload } from './utils/types';
import { mockDreamSelection } from './utils/mock';
import { BotsRules, DreamSelectionExtendedRules, DreamSelectionRules } from './components/RulesBlobs';
import { SelectTable } from './components/SelectTable';

const validateSelectedCards = (v: Dictionary<boolean>) => {
  return Object.keys(v).length < 10;
};

type StepDreamsSelectionProps = {
  table: ImageCardObj[];
  word: TextCard;
  onSubmitCards: (payload: SubmitCardsPayload) => void;
  botEnabled: boolean;
  minimumSelection: number;
} & Pick<StepProps, 'announcement'>;

export function StepDreamsSelection({
  table,
  word,
  onSubmitCards,
  botEnabled,
  announcement,
  minimumSelection,
}: StepDreamsSelectionProps) {
  const {
    dict: selectedCards,
    updateDict: onSelectCard,
    length: selectedCount,
  } = useBooleanDictionary({}, validateSelectedCards);

  useMock(() => {
    onSubmitCards({ cardsIds: mockDreamSelection(table, minimumSelection) });
  }, []);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <Title size="medium">
        <Translate
          pt="Visite sonhos relacionados a "
          en="Visit dreams related to "
        />
        <TextHighlight>{word.text}</TextHighlight>
      </Title>
      <DreamSelectionRules
        contained
        minimumSelection={minimumSelection}
      />

      <PopoverRule content={<DreamSelectionExtendedRules />} />

      {botEnabled && (
        <FixedMenuButton
          type="popover"
          position={1}
          icon={<RobotOutlined />}
          content={<BotsRules />}
          label={
            <Translate
              pt=" Bots"
              en=" Bots"
            />
          }
        />
      )}

      <SelectTable
        table={table}
        onSelectCard={onSelectCard}
        selectedCards={selectedCards}
      />

      <SpaceFloat
        className="mt-4 container--center"
        enabled={selectedCount >= minimumSelection}
      >
        <SendButton
          size="large"
          disabled={selectedCount < minimumSelection || selectedCount > 10}
          onClick={() => onSubmitCards({ cardsIds: Object.keys(selectedCards) })}
        >
          <Translate
            pt={`Visitar ${selectedCount} sonhos`}
            en={`Visit ${selectedCount} dreams`}
          />
        </SendButton>
      </SpaceFloat>
    </Step>
  );
}
