// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { getAnimationClass, pluralize } from 'utils/helpers';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { InquiryHistoryEntry, Item, RequestHistoryEntry, Sign } from './utils/types';
import { OfferingsStatus } from './utils/types';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { AlienWritingBoard } from './components/AlienWritingBoard';
import { AlienContent, HumanContent } from './components/Content';
import { History } from './components/History';
import { Status } from './components/Status';
import { AlienViewBoard } from './components/AlienViewBoard';
import { BotPopupRule } from './components/BotPopupRules';

type StepAlienAnswersProps = {
  players: GamePlayers;
  onSubmitAlienResponse: GenericFunction;
  onConfirmNote: GenericFunction;
  user: GamePlayer;
  alien: GamePlayer;
  isUserAlien: boolean;
  currentHuman: GamePlayer;
  items: Item[];
  signs: Sign[];
  status: OfferingsStatus;
  currentInquiry: CardId[];
  alienResponse?: string;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  isAlienBot: boolean;
  startingAttributes: Sign[];
  debugMode: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepAlienAnswers({
  players,
  announcement,
  user,
  onSubmitAlienResponse,
  onConfirmNote,
  items,
  signs,
  alien,
  isUserAlien,
  currentHuman,
  currentInquiry,
  alienResponse,
  requestHistory,
  inquiryHistory,
  status,
  isAlienBot,
  startingAttributes,
  debugMode,
}: StepAlienAnswersProps) {
  const { isLoading } = useLoading();
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');

  // Dev Only
  useMock(() => onConfirmNote());

  const hasAlienResponse = Boolean(alienResponse);

  return (
    <Step fullWidth announcement={announcement}>
      <Title icon={hasAlienResponse ? null : <IconAvatar icon={<AnimatedClockIcon />} size="large" />}>
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
      </Title>

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

      <Space className="space-container" wrap>
        {currentInquiry.map((itemId) => (
          <ItemCard key={`inquiry-${itemId}`} id={itemId} />
        ))}
      </Space>

      <ViewIf condition={!hasAlienResponse}>
        <AlienContent user={user}>
          <RuleInstruction type="action">
            <Translate
              pt={
                <>
                  Escreva um único símbolo que você acha que representa{' '}
                  {pluralize(currentInquiry.length, 'o objeto', 'os objetos')} melhor.
                </>
              }
              en={
                <>
                  Write a single symbol that you think represents the{' '}
                  {pluralize(currentInquiry.length, 'object')} the best
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

        <AlienViewBoard
          request={alienResponse!}
          isAlienBot={isAlienBot}
          className={getAnimationClass('fadeIn')}
        />

        <HumanContent user={user}>
          <Space className="space-container">
            <Button
              type="primary"
              size="large"
              onClick={() => onConfirmNote()}
              disabled={isLoading || user.ready}
            >
              <Translate pt="Anotei o símbolo e estou pronto" en="I have noted the symbol and I'm ready" />
            </Button>
          </Space>
        </HumanContent>
      </ViewIf>

      <AlienContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} activeObjects={currentInquiry} status={status} />
          <SignsKeyCard signs={signs} startingAttributes={startingAttributes} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} activeObjects={currentInquiry} status={status} />
          <HumanSignBoard signs={signs} startingAttributes={startingAttributes} />
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
