// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { AvatarName } from 'components/avatars';
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type {
  InquiryHistoryEntry,
  OfferingsStatus,
  PhaseBasicState,
  RequestHistoryEntry,
  SubmitOfferingsPayload,
} from './utils/types';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { AlienContent, HumanContent } from './components/Content';
import { HumanOffering } from './components/HumanOffering';
import { History } from './components/History';
import { Status } from './components/Status';
import { AlienViewBoard } from './components/AlienViewBoard';
import { BotPopupRule } from './components/BotPopupRules';
import { ItemsHighlight } from './components/Highlights';

type StepHumansOfferProps = {
  players: GamePlayers;
  onSubmitOfferings: (payload: SubmitOfferingsPayload) => void;
  user: GamePlayer;
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

export function StepHumansOffer({
  players,
  announcement,
  user,
  onSubmitOfferings,
  status,
  items,
  attributes,
  startingAttributesIds,
  alien,
  isUserAlien,
  requestHistory,
  inquiryHistory,
  isAlienBot,
  debugMode,
}: StepHumansOfferProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');
  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt={<>Ofereça um objeto</>} en={<>Offer an object</>} />
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      {isAlienBot && <BotPopupRule />}

      <HumanContent user={user}>
        <RuleInstruction type="action">
          <Translate
            pt={
              <>
                O(A) alienígena <AvatarName player={alien} /> fez esse pedido. Você consegue decifrar qual
                objeto ele(a) quer?
                <br />
                Um símbolo sublinhado significa "muito" e um símbolo sobrelinhado significa "não".
                <br />
                <strong>Selecione</strong> um objeto e aperte enviar. Lembre-se que que você tem que entregar{' '}
                <ItemsHighlight type="negative">{status.needed}</ItemsHighlight>
                objetos.
              </>
            }
            en={
              <>
                The alien <AvatarName player={alien} /> made this request. Can you decipher what object they
                want?
                <br />
                An underlined symbol means "very" and an overscore symbol means "not".
                <br />
                <strong>Select</strong> an object then press Submit. Remember that you must deliver{' '}
                <ItemsHighlight type="negative">{status.needed}</ItemsHighlight> objects.
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

      <AlienViewBoard
        request={requestHistory[0].request}
        isAlienBot={isAlienBot}
        attributes={attributes}
        sentenceMode={isAlienBot}
      />

      <AlienContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} status={status} />
          <SignsKeyCard attributes={attributes} startingAttributesIds={startingAttributesIds} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="boards-container" wrap>
          <HumanOffering
            attributes={attributes}
            startingAttributesIds={startingAttributesIds}
            items={items}
            submitOffer={onSubmitOfferings}
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
