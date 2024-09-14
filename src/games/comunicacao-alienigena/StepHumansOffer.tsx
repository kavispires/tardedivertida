// Ant Design Resources
import { Space } from 'antd';
// Types
import { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { AvatarName } from 'components/avatars';
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { InquiryHistoryEntry, Item, OfferingsStatus, RequestHistoryEntry, Sign } from './utils/types';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { AlienContent, HumanContent } from './components/Content';
import { HumanOffering } from './components/HumanOffering';
import { History } from './components/History';
import { Status } from './components/Status';
import { AlienViewBoard } from './components/AlienViewBoard';
import { BotPopupRule } from './components/BotPopupRules';

type StepHumansOfferProps = {
  players: GamePlayers;
  onSubmitOffering: GenericFunction;
  user: GamePlayer;
  alien: GamePlayer;
  isUserAlien: boolean;
  items: Item[];
  signs: Sign[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  isAlienBot: boolean;
  startingAttributes: Sign[];
  debugMode: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepHumansOffer({
  players,
  announcement,
  user,
  onSubmitOffering,
  status,
  items,
  signs,
  alien,
  isUserAlien,
  requestHistory,
  inquiryHistory,
  isAlienBot,
  startingAttributes,
  debugMode,
}: StepHumansOfferProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');
  return (
    <Step fullWidth announcement={announcement}>
      <Title white>
        <Translate pt={<>Ofereça um objeto</>} en={<>Offer an object</>} />
      </Title>

      <PopoverRule content={<Status status={status} />} />

      {isAlienBot && <BotPopupRule />}

      <HumanContent user={user}>
        <RuleInstruction type="rule">
          <Translate
            pt={
              <>
                O(A) alienígena <AvatarName player={alien} /> fez esse pedido. Você consegue decifrar qual
                objeto ele(a) quer?
                <br />
                Um símbolo sublinhado significa "muito" e um símbolo sobrelinhado significa "não".
              </>
            }
            en={
              <>
                The alien <AvatarName player={alien} /> made this request. Can you decipher what object they
                want?
                <br />
                An underlined symbol means "very" and an overscore symbol means "not".
              </>
            }
          />
        </RuleInstruction>
      </HumanContent>

      <AlienContent user={user}>
        <RuleInstruction type="wait">
          <Translate
            pt={<>Aguarde enquanto os humanos escolhem um objeto para te oferecer.</>}
            en={<>Wait while the humans choose an object to offer.</>}
          />
        </RuleInstruction>
      </AlienContent>

      <AlienViewBoard request={requestHistory[0].request} isAlienBot={isAlienBot} />

      <AlienContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} status={status} />
          <SignsKeyCard signs={signs} startingAttributes={startingAttributes} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="boards-container" wrap>
          <HumanOffering
            signs={signs}
            startingAttributes={startingAttributes}
            items={items}
            submitOffer={onSubmitOffering}
            user={user}
            status={status}
          />
        </Space>
      </HumanContent>

      <History
        inquiryHistory={inquiryHistory}
        requestHistory={requestHistory}
        players={players}
        items={items}
        isAlienBot={isAlienBot}
        signs={signs}
        showIntention={isDebugEnabled}
        debugMode={debugMode}
      />

      <DebugOnly>
        <SignsKeyCard signs={signs} startingAttributes={startingAttributes} />
      </DebugOnly>
    </Step>
  );
}
