// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GameRound, GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useGlobalState } from '@hooks/useGlobalState';
// Components
import { ItemCard } from '@components/cards/ItemCard';
import { DebugOnly } from '@components/debug/DebugOnly';
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PopoverRule } from '@components/rules/PopoverRule';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { ViewIf } from '@components/views/ViewIf';
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
import { ItemsHighlight } from './components/Highlights';

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
  curses: Record<UID, UID[]>;
  round: GameRound;
  isAlienBot: boolean;
  debugMode: boolean;
  knownSpriteIds: string[];
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
  knownSpriteIds,
  debugMode,
}: StepRevealProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');
  const latestRequest = requestHistory?.[0] ?? {};

  const objectsRemaining = Math.max(0, status.needed - status.found);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Resultado"
          en="Results"
        />
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
          en="{objectsRemaining} objects left to be offered. We have {time} attempts left."
          pt="Faltam {objectsRemaining} objetos a serem oferecidos. Temos {time} chances."
          values={{
            objectsRemaining: <ItemsHighlight>{objectsRemaining}</ItemsHighlight>,
            time: <TimeHighlight>{status.timeLeft}</TimeHighlight>,
          }}
        />
      </RuleInstruction>

      <SpaceContainer wrap>
        {Boolean(latestRequest) &&
          latestRequest.offers.map((entry) => {
            return (
              <SpaceContainer
                key={`offer-${entry.playerId}-${entry.objectId}`}
                vertical
                contained
              >
                <ItemCard
                  itemId={`${entry.objectId}`}
                  className={''}
                  width={48}
                />
                <PlayerAvatarName player={players[entry.playerId]} />
                <ItemResolution
                  itemId={entry.objectId}
                  items={items}
                />
              </SpaceContainer>
            );
          })}
      </SpaceContainer>

      <HostNextPhaseButton
        round={round}
        withWaitingTimeBar
      />

      <AlienContent user={user}>
        <Space
          className="boards-container"
          wrap
        >
          <ObjectsGrid
            items={items}
            showTypes={isUserAlien}
            status={status}
          />
          <SignsKeyCard
            attributes={attributes}
            startingAttributesIds={startingAttributesIds}
            inquiryHistory={inquiryHistory}
          />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
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
        <SignsKeyCard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          inquiryHistory={inquiryHistory}
        />
      </DebugOnly>
    </Step>
  );
}
