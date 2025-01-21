// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Icons
import { ClockIcon } from 'icons/ClockIcon';
import { PlayerIconsIcon } from 'icons/PlayerIconsIcon';
// Components
import { AvatarName } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { DebugOnly } from 'components/debug';
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { MetricHighlight } from 'components/metrics/MetricHighlight';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type {
  InquiryHistoryEntry,
  OfferingsStatus,
  PhaseBasicState,
  RequestHistoryEntry,
} from './utils/types';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { AlienContent, HumanContent } from './components/Content';
import { ItemResolution } from './components/ItemResolution';
import { History } from './components/History';
import { Status } from './components/Status';
import { AlienViewBoard } from './components/AlienViewBoard';
import { BotPopupRule } from './components/BotPopupRules';

type StepRevealProps = {
  players: GamePlayers;
  user: GamePlayer;
  alien: GamePlayer;
  isUserAlien: boolean;
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  wasCurseSelected: boolean;
  curses: Record<CardId, PlayerId[]>;
  round: GameRound;
  isAlienBot: boolean;
  debugMode: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepReveal({
  players,
  announcement,
  user,
  status,
  items,
  attributes,
  isUserAlien,
  round,
  requestHistory,
  inquiryHistory,
  isAlienBot,
  startingAttributesIds,
  debugMode,
}: StepRevealProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');
  const latestRequest = requestHistory?.[0] ?? {};

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt={<>Resultado</>} en={<>Results</>} />
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      {isAlienBot && <BotPopupRule />}

      <ViewIf condition={Boolean(latestRequest)}>
        <AlienViewBoard
          request={latestRequest.request}
          isAlienBot={isAlienBot}
          attributes={attributes}
          sentenceMode
        />
      </ViewIf>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Faltam{' '}
              <MetricHighlight icon={<PlayerIconsIcon />}>{status.needed - status.found}</MetricHighlight>{' '}
              objetos a serem oferecidos.
              <br />
              Temos <MetricHighlight icon={<ClockIcon />}>{status.timeLeft} </MetricHighlight> chances.
            </>
          }
          en={
            <>
              <MetricHighlight icon={<PlayerIconsIcon />}>{status.needed - status.found}</MetricHighlight>{' '}
              objects left to be offered.
              <br />
              We have <MetricHighlight icon={<ClockIcon />}>{status.timeLeft} </MetricHighlight> attempts
              left.
            </>
          }
        />
      </RuleInstruction>

      <Instruction contained>
        <SpaceContainer wrap>
          {Boolean(latestRequest) &&
            latestRequest.offers.map((entry) => {
              return (
                <SpaceContainer key={`offer-${entry.playerId}-${entry.objectId}`} vertical>
                  <ItemCard id={`${entry.objectId}`} className={''} width={50} />
                  <AvatarName player={players[entry.playerId]} />
                  <ItemResolution itemId={entry.objectId} items={items} />
                </SpaceContainer>
              );
            })}
        </SpaceContainer>
      </Instruction>

      <HostNextPhaseButton round={round} withWaitingTimeBar />

      <AlienContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} status={status} />
          <SignsKeyCard attributes={attributes} startingAttributesIds={startingAttributesIds} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} status={status} />
          <HumanSignBoard attributes={attributes} startingAttributesIds={startingAttributesIds} />
        </Space>
      </HumanContent>

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
        <SignsKeyCard attributes={attributes} startingAttributesIds={startingAttributesIds} />
      </DebugOnly>
    </Step>
  );
}
