// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { DebugOnly } from 'components/debug/DebugOnly';
import { Translate } from 'components/language/Translate';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { PopoverRule } from 'components/rules/PopoverRule';
import { Step, type StepProps } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type {
  InquiryHistoryEntry,
  OfferingsStatus,
  PhaseBasicState,
  RequestHistoryEntry,
} from './utils/types';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { History } from './components/History';
import { Status } from './components/Status';
import { ItemsHighlight } from './components/Highlights';

type StepHumansAskWaitProps = {
  players: GamePlayers;
  alien: GamePlayer;
  isUserAlien: boolean;
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  isAlienBot: boolean;
  debugMode: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepHumansAskWait({
  announcement,
  players,
  items,
  attributes,
  alien,
  requestHistory,
  inquiryHistory,
  status,
  isAlienBot,
  startingAttributesIds,
  debugMode,
}: StepHumansAskWaitProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle wait>
        <Translate
          pt="Os humanos estão se preparando para contato"
          en="Humans are preparing for contact"
        />
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      <RuleInstruction type="wait">
        <Translate
          pt={
            <>
              Aguarde enquanto os jogadores selecionam <ItemsHighlight>1-5 itens</ItemsHighlight> para
              perguntar ao alienígena <PlayerAvatarName player={alien} /> qual o símbolo relacionado a eles.
            </>
          }
          en={
            <>
              Please wait while the players select <ItemsHighlight>1-5 items</ItemsHighlight> to ask the alien{' '}
              <PlayerAvatarName player={alien} /> what symbol is related to them.
            </>
          }
        />
      </RuleInstruction>

      <Space
        className="boards-container"
        wrap
      >
        <ObjectsGrid
          items={items}
          showTypes
          status={status}
        />
        <SignsKeyCard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          inquiryHistory={inquiryHistory}
        />
      </Space>

      <History
        inquiryHistory={inquiryHistory}
        requestHistory={requestHistory}
        players={players}
        items={items}
        isAlienBot={isAlienBot}
        attributes={attributes}
        showIntention={isDebugEnabled}
        debugMode={debugMode}
      />

      <DebugOnly>
        <SignsKeyCard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          inquiryHistory={inquiryHistory}
        />
      </DebugOnly>
    </Step>
  );
}
