// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { pluralize } from 'utils/helpers';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { ViewIf } from 'components/views';
import { AlienWritingBoard } from './components/AlienWritingBoard';
import { AlienContent, HumanContent } from './components/Content';
import { History } from './components/History';
import { PopoverRule } from 'components/rules';
import { Status } from './components/Status';
import { AlienViewBoard } from './components/AlienViewBoard';
import { ItemCard } from 'components/cards/ItemCard';
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
} & AnnouncementProps;

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
}: StepAlienAnswersProps) {
  const { isLoading } = useLoading();

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
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

      <Instruction contained>
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
      </Instruction>

      <Space className="space-container" wrap>
        {currentInquiry.map((itemId) => (
          <ItemCard key={`inquiry-${itemId}`} id={itemId} />
        ))}
      </Space>

      <ViewIf condition={!Boolean(alienResponse)}>
        <AlienContent user={user}>
          <Instruction contained>
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
          </Instruction>
          <AlienWritingBoard
            onSubmit={(alienResponse) => onSubmitAlienResponse({ alienResponse })}
            disabled={isLoading}
          />
        </AlienContent>
      </ViewIf>

      <ViewIf condition={Boolean(alienResponse)}>
        <Instruction contained>
          <Translate pt={<>O Alienígena respondeu:</>} en={<>The Alien answered:</>} />
        </Instruction>

        <AlienViewBoard request={alienResponse!} isAlienBot={isAlienBot} />

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
        <Space className="space-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} activeObjects={currentInquiry} />
          <SignsKeyCard signs={signs} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="space-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} activeObjects={currentInquiry} />
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
    </Step>
  );
}