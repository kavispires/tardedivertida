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
import { ViewIf } from 'components/views';
// Internal
import type {
  InquiryHistoryEntry,
  OfferingsStatus,
  PhaseBasicState,
  RequestHistoryEntry,
  SubmitHumanInquiryPayload,
} from './utils/types';
import { COMUNICACAO_ALIENIGENA_PHASES } from './utils/constants';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { HumanInquiry } from './components/HumanInquiry';
import { AlienContent, HumanContent } from './components/Content';
import { History } from './components/History';
import { Status } from './components/Status';
import { BotPopupRule } from './components/BotPopupRules';
import { ItemsHighlight } from './components/Highlights';
import { InquirySuggestions } from './components/Suggestions';

type StepHumanAsksProps = {
  players: GamePlayers;
  onSubmitHumanInquiry: (payload: SubmitHumanInquiryPayload) => void;
  user: GamePlayer;
  alien: GamePlayer;
  isUserAlien: boolean;
  currentHuman: GamePlayer;
  isUserTheCurrentHuman: boolean;
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  isAlienBot: boolean;
  debugMode: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepHumanAsks({
  user,
  announcement,
  players,
  onSubmitHumanInquiry,
  items,
  attributes,
  alien,
  isUserAlien,
  currentHuman,
  isUserTheCurrentHuman,
  requestHistory,
  inquiryHistory,
  status,
  isAlienBot,
  startingAttributesIds,
  debugMode,
}: StepHumanAsksProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');
  return (
    <Step fullWidth announcement={isUserTheCurrentHuman ? announcement : undefined}>
      <StepTitle>
        {isUserTheCurrentHuman ? (
          <Translate pt={<>Pergunte ao Alienígena!</>} en={<>Ask the Alien!</>} />
        ) : (
          <Translate pt={<>Perguntas ao Alienígena</>} en={<>Asking the Alien</>} />
        )}
      </StepTitle>

      {isAlienBot && <BotPopupRule />}

      <PopoverRule content={<Status status={status} />} />

      <RuleInstruction type={isUserTheCurrentHuman ? 'action' : 'wait'}>
        {isUserTheCurrentHuman ? (
          <>
            <Translate
              pt={
                <>
                  Escolha um dos atributos que você deseja desvendar, então, selecione{' '}
                  <ItemsHighlight>1-5 itens</ItemsHighlight>
                  relacionados a esse atributo para que o alienígena diga qual é o símbolo correspondente.
                  <InquirySuggestions
                    items={items}
                    attributes={attributes}
                    startingAttributesIds={startingAttributesIds}
                  />
                </>
              }
              en={
                <>
                  Choose one of the atributes you want to unveil, then select{' '}
                  <ItemsHighlight>1-5 items</ItemsHighlight> below to ask the alien what its symbol.
                </>
              }
            />
          </>
        ) : (
          <>
            <Translate
              pt={
                <>
                  Aguarde enquanto <AvatarName player={currentHuman} /> seleciona{' '}
                  <ItemsHighlight>1-5 itens</ItemsHighlight> para perguntar ao alienígena{' '}
                  <AvatarName player={alien} /> qual o símbolo relacionado a eles.
                </>
              }
              en={
                <>
                  Please wait wile <AvatarName player={currentHuman} /> selects{' '}
                  <ItemsHighlight>1-5 items</ItemsHighlight> to ask the alien <AvatarName player={alien} />{' '}
                  what symbol is related to them.
                </>
              }
            />
          </>
        )}
      </RuleInstruction>

      <AlienContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} status={status} />
          <SignsKeyCard
            attributes={attributes}
            startingAttributesIds={startingAttributesIds}
            phase={COMUNICACAO_ALIENIGENA_PHASES.HUMAN_ASK}
          />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <ViewIf condition={isUserTheCurrentHuman}>
          <HumanInquiry
            items={items}
            attributes={attributes}
            submitInquiry={onSubmitHumanInquiry}
            user={user}
            startingAttributesIds={startingAttributesIds}
            status={status}
          />
        </ViewIf>

        <ViewIf condition={!isUserTheCurrentHuman}>
          <Space className="boards-container" wrap>
            <ObjectsGrid items={items} showTypes={false} status={status} />
            <HumanSignBoard attributes={attributes} startingAttributesIds={startingAttributesIds} />
          </Space>
        </ViewIf>
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
