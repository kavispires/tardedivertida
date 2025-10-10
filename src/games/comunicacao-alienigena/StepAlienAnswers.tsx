// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLoading } from 'hooks/useLoading';
// Utils
import { getAnimationClass, pluralize } from 'utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { SendButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type {
  InquiryHistoryEntry,
  PhaseAlienAnswerState,
  PhaseBasicState,
  RequestHistoryEntry,
  SubmitAlienResponsePayload,
} from './utils/types';
import type { OfferingsStatus } from './utils/types';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { AlienWritingBoard } from './components/AlienWritingBoard';
import { AlienContent, HumanContent } from './components/Content';
import { History } from './components/History';
import { Status } from './components/Status';
import { AlienViewBoard } from './components/AlienViewBoard';
import { BotPopupRule } from './components/BotPopupRules';
import { AnswerSuggestions } from './components/Suggestions';

type StepAlienAnswersProps = {
  players: GamePlayers;
  onSubmitAlienResponse: (payload: SubmitAlienResponsePayload) => void;
  onConfirmNote: () => void;
  user: GamePlayer;
  alien: GamePlayer;
  isUserAlien: boolean;
  currentHuman: GamePlayer;
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  suggestions: PhaseAlienAnswerState['suggestions'];
  startingAttributesIds: string[];
  status: OfferingsStatus;
  currentInquiry: CardId[];
  alienResponse?: string;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  isAlienBot: boolean;
  debugMode: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepAlienAnswers({
  players,
  announcement,
  user,
  onSubmitAlienResponse,
  onConfirmNote,
  items,
  attributes,
  alien,
  isUserAlien,
  currentHuman,
  currentInquiry,
  alienResponse,
  requestHistory,
  inquiryHistory,
  status,
  isAlienBot,
  startingAttributesIds,
  suggestions,
  debugMode,
}: StepAlienAnswersProps) {
  const { isLoading } = useLoading();
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');

  const hasAlienResponse = Boolean(alienResponse);

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle wait={!hasAlienResponse}>
        <Translate
          pt={
            <>
              Alienígena <AvatarName player={alien} /> responde
            </>
          }
          en={
            <>
              Alien <AvatarName player={alien} /> answers
            </>
          }
        />
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      {isAlienBot && <BotPopupRule />}

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              <AvatarName player={currentHuman} /> quer saber qual símbolo representa{' '}
              {pluralize(currentInquiry.length, 'o objeto', 'os objetos')} abaixo:
            </>
          }
          en={
            <>
              <AvatarName player={currentHuman} /> wants to know what symbol best represents the{' '}
              {pluralize(currentInquiry.length, 'object')} below:
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer wrap>
        {currentInquiry.map((itemId) => (
          <ItemCard key={`inquiry-${itemId}`} itemId={itemId} width={64} />
        ))}
      </SpaceContainer>

      <ViewIf condition={!hasAlienResponse}>
        <AlienContent user={user}>
          <RuleInstruction type="action">
            <Translate
              pt={
                <>
                  Escreva um único símbolo que você acha que representa{' '}
                  {pluralize(currentInquiry.length, 'o objeto', 'os objetos')} melhor.{' '}
                  <AnswerSuggestions suggestions={suggestions} />
                </>
              }
              en={
                <>
                  Write a single symbol that you think represents the{' '}
                  {pluralize(currentInquiry.length, 'object')} the best.{' '}
                  <AnswerSuggestions suggestions={suggestions} />
                </>
              }
            />
          </RuleInstruction>
          <AlienWritingBoard
            onSubmit={(alienResponse) => onSubmitAlienResponse({ alienResponse })}
            disabled={isLoading}
          />
        </AlienContent>
      </ViewIf>

      <ViewIf condition={hasAlienResponse}>
        <RuleInstruction type="event">
          <Translate pt={<>O Alienígena respondeu:</>} en={<>The Alien answered:</>} />
        </RuleInstruction>

        {!!alienResponse && (
          <AlienViewBoard
            request={alienResponse}
            isAlienBot={isAlienBot}
            className={getAnimationClass('fadeIn')}
            attributes={attributes}
          />
        )}

        <HumanContent user={user}>
          <SpaceContainer>
            <SendButton size="large" onClick={() => onConfirmNote()} disabled={isLoading || user.ready}>
              <Translate pt="Anotei o símbolo e estou pronto" en="I have noted the symbol and I'm ready" />
            </SendButton>
          </SpaceContainer>
        </HumanContent>
      </ViewIf>

      <AlienContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} activeObjects={currentInquiry} status={status} />
          <SignsKeyCard attributes={attributes} startingAttributesIds={startingAttributesIds} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} activeObjects={currentInquiry} status={status} />
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
