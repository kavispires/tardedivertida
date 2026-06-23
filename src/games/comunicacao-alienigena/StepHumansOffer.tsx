// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useGlobalState } from '@hooks/useGlobalState';
// Components
import { DebugOnly } from '@components/debug/DebugOnly';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
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
  SubmitOfferingsPayload,
} from './utils/types';
import { SignsKeyCard } from './components/SignsKeyCard';
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
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  knownSpriteIds: string[];
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
  knownSpriteIds,
  alien,
  requestHistory,
  inquiryHistory,
  isAlienBot,
  debugMode,
}: StepHumansOfferProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Ofereça um objeto"
          en="Offer an object"
        />
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      {isAlienBot && <BotPopupRule />}

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              O(A) alienígena <PlayerAvatarName player={alien} /> fez esse pedido. Você consegue decifrar qual
              objeto ele(a) quer?
              <br />
              Um símbolo sublinhado significa "muito" e um símbolo sobrelinhado significa "não".
              <br />
              <strong>Selecione</strong> um (ou mais) objeto(s) e aperte enviar. Lembre-se que que você tem
              que entregar <ItemsHighlight type="negative">{status.needed}</ItemsHighlight>
              objetos.
            </>
          }
          en={
            <>
              The alien <PlayerAvatarName player={alien} /> made this request. Can you decipher what object
              they want?
              <br />
              An underlined symbol means "very" and an overscore symbol means "not".
              <br />
              <strong>Select</strong> one (or more) object(s) then press Submit. Remember that you must
              deliver <ItemsHighlight type="negative">{status.needed}</ItemsHighlight> objects.
            </>
          }
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
        <HumanOffering
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          items={items}
          submitOffer={onSubmitOfferings}
          user={user}
          status={status}
          knownSpriteIds={knownSpriteIds}
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
