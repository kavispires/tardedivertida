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
  SubmitHumanInquiryPayload,
} from './utils/types';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanInquiry } from './components/HumanInquiry';
import { History } from './components/History';
import { Status } from './components/Status';
import { BotPopupRule } from './components/BotPopupRules';
import { ItemsHighlight } from './components/Highlights';

type StepHumansAskProps = {
  players: GamePlayers;
  onSubmitHumanInquiry: (payload: SubmitHumanInquiryPayload) => void;
  user: GamePlayer;
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  knownSpriteIds: string[];
  isAlienBot: boolean;
  debugMode: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepHumansAsk({
  user,
  announcement,
  players,
  onSubmitHumanInquiry,
  items,
  attributes,
  requestHistory,
  inquiryHistory,
  status,
  isAlienBot,
  startingAttributesIds,
  knownSpriteIds,
  debugMode,
}: StepHumansAskProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Pergunte ao Alienígena!"
          en="Ask the Alien!"
        />
      </StepTitle>

      {isAlienBot && <BotPopupRule />}

      <PopoverRule content={<Status status={status} />} />

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Escolha um dos atributos que você deseja desvendar, então, selecione{' '}
              <ItemsHighlight>1-5 itens</ItemsHighlight>
              relacionados a esse atributo para que o alienígena diga qual é o símbolo correspondente.
            </>
          }
          en={
            <>
              Choose one of the atributes you want to unveil, then select{' '}
              <ItemsHighlight>1-5 items</ItemsHighlight> below to ask the alien what its symbol.
            </>
          }
        />
      </RuleInstruction>

      <HumanInquiry
        items={items}
        attributes={attributes}
        submitInquiry={onSubmitHumanInquiry}
        user={user}
        startingAttributesIds={startingAttributesIds}
        status={status}
        knownSpriteIds={knownSpriteIds}
      />

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
