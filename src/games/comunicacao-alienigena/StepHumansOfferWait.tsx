// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useGlobalState } from '@hooks/useGlobalState';
// Components
import { DebugOnly } from '@components/debug/DebugOnly';
import { Translate } from '@components/language/Translate';
import { PopoverRule } from '@components/rules/PopoverRule';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
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
import { AlienViewBoard } from './components/AlienViewBoard';
import { BotPopupRule } from './components/BotPopupRules';

type StepHumansOfferWaitProps = {
  players: GamePlayers;
  user: GamePlayer;
  alien: GamePlayer;
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  isAlienBot: boolean;
  debugMode: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepHumansOfferWait({
  players,
  announcement,
  status,
  items,
  attributes,
  startingAttributesIds,
  requestHistory,
  inquiryHistory,
  isAlienBot,
  debugMode,
}: StepHumansOfferWaitProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle wait>
        <Translate
          pt="Agora aguarde enquanto os humanos escolhem objetos para oferecer."
          en="Now wait while the humans choose objects to offer."
        />
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      {isAlienBot && <BotPopupRule />}

      <RuleInstruction type="wait">
        <Translate
          pt="Aguarde enquanto os humanos escolhem um objeto para te oferecer."
          en="Wait while the humans choose an object to offer."
        />
      </RuleInstruction>

      <AlienViewBoard
        request={requestHistory[0].request}
        isAlienBot={isAlienBot}
        attributes={attributes}
        sentenceMode={isAlienBot}
      />

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
