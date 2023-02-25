// Ant Design Resources
import { Space } from 'antd';
// Icons
import { IconsIcon } from 'icons/IconsIcon';
import { ClockIcon } from 'icons/ClockIcon';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { AdminNextPhaseButton } from 'components/admin';
import { MetricHighlight } from 'components/metrics/MetricHighlight';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { AlienContent, HumanContent } from './components/Content';
import { ItemResolution } from './components/ItemResolution';
import { History } from './components/History';
import { PopoverRule } from 'components/rules';
import { Status } from './components/Status';
import { AlienViewBoard } from './components/AlienViewBoard';
import { BotPopupRule } from './components/BotPopupRules';

type StepRevealProps = {
  players: GamePlayers;
  user: GamePlayer;
  alien: GamePlayer;
  isUserAlien: boolean;
  items: Item[];
  signs: Sign[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  wasCurseSelected: boolean;
  curses: Record<CardId, PlayerId[]>;
  round: GameRound;
  isAlienBot: boolean;
} & AnnouncementProps;

export function StepReveal({
  players,
  announcement,
  user,
  status,
  items,
  signs,
  isUserAlien,
  round,
  requestHistory,
  inquiryHistory,
  isAlienBot,
}: StepRevealProps) {
  const latestRequest = requestHistory[0];

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt={<>Resultado</>} en={<>Results</>} />
      </Title>

      <PopoverRule content={<Status status={status} />} />

      {isAlienBot && <BotPopupRule />}

      <Instruction contained>
        <Translate
          pt={
            <>
              Faltam <MetricHighlight icon={<IconsIcon />}>{status.needed - status.found}</MetricHighlight>{' '}
              objetos a serem oferecidos.
              <br />
              Temos <MetricHighlight icon={<ClockIcon />}>{status.timeLeft} </MetricHighlight> chances.
            </>
          }
          en={
            <>
              <MetricHighlight icon={<IconsIcon />}>{status.needed - status.found}</MetricHighlight> objects
              left to be offered.
              <br />
              We have <MetricHighlight icon={<ClockIcon />}>{status.timeLeft} </MetricHighlight> attempts
              left.
            </>
          }
        />
      </Instruction>

      <AlienViewBoard request={latestRequest.request} isAlienBot={isAlienBot} />

      <Instruction contained>
        <Space className="space-container" wrap>
          {latestRequest.offers.map((entry, index) => {
            return (
              <Space key={`offer-${index}`} direction="vertical" className="space-container">
                <ItemCard id={`${entry.objectId}`} className={''} width={50} />
                <AvatarName player={players[entry.playerId]} />
                <ItemResolution itemId={entry.objectId} items={items} />
              </Space>
            );
          })}
        </Space>
      </Instruction>

      <AlienContent user={user}>
        <Space className="space-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} />
          <SignsKeyCard signs={signs} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="space-container" wrap>
          <ObjectsGrid items={items} />
          <HumanSignBoard signs={signs} />
        </Space>
      </HumanContent>

      <History
        inquiryHistory={inquiryHistory}
        requestHistory={requestHistory}
        players={players}
        items={items}
        isAlienBot={isAlienBot}
      />

      <AdminNextPhaseButton round={round} autoTriggerTime={30} />
    </Step>
  );
}
