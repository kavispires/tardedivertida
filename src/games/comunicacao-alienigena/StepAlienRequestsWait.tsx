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
  SubmitAlienRequestPayload,
} from './utils/types';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { History } from './components/History';
import { Status } from './components/Status';

type StepAlienRequestsWaitProps = {
  players: GamePlayers;
  onSubmitAlienRequest: (payload: SubmitAlienRequestPayload) => void;
  user: GamePlayer;
  alien: GamePlayer;
  isUserAlien: boolean;
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  debugMode: boolean;
  knownSpriteIds: string[];
} & Pick<StepProps, 'announcement'>;

export function StepAlienRequestsWait({
  players,
  announcement,
  items,
  attributes,
  alien,
  requestHistory,
  inquiryHistory,
  status,
  startingAttributesIds,
  debugMode,
  knownSpriteIds,
}: StepAlienRequestsWaitProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={
            <>
              Alienígena <PlayerAvatarName player={alien} /> deve pedir um item
            </>
          }
          en={
            <>
              Alien <PlayerAvatarName player={alien} /> must request an item
            </>
          }
        />
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      <RuleInstruction type="wait">
        <Translate
          pt={
            <>
              Aguarde enquanto <PlayerAvatarName player={alien} /> escreve o objeto que ele(a) quer.
            </>
          }
          en={
            <>
              Wait while <PlayerAvatarName player={alien} /> describes a desired object.
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
          status={status}
        />
        <HumanSignBoard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          knownSpriteIds={knownSpriteIds}
        />
      </Space>

      <History
        inquiryHistory={inquiryHistory}
        requestHistory={requestHistory}
        players={players}
        items={items}
        isAlienBot={false}
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
