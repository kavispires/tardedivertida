// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { ViewIf } from 'components/views';
import { HumanInquiry } from './components/HumanInquiry';
import { AlienContent, HumanContent } from './components/Content';
import { History } from './components/History';
import { PopoverRule } from 'components/rules';
import { Status } from './components/Status';
import { BotPopupRule } from './components/BotPopupRules';
import { ItemsHighlight } from './components/Highlights';
import { DebugOnly } from 'components/debug';

type StepHumanAsksProps = {
  players: GamePlayers;
  onSubmitHumanInquiry: GenericFunction;
  user: GamePlayer;
  alien: GamePlayer;
  isUserAlien: boolean;
  currentHuman: GamePlayer;
  isUserTheCurrentHuman: boolean;
  items: Item[];
  signs: Sign[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  isAlienBot: boolean;
} & AnnouncementProps;

export function StepHumanAsks({
  user,
  announcement,
  players,
  onSubmitHumanInquiry,
  items,
  signs,
  alien,
  isUserAlien,
  currentHuman,
  isUserTheCurrentHuman,
  requestHistory,
  inquiryHistory,
  status,
  isAlienBot,
}: StepHumanAsksProps) {
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');
  return (
    <Step fullWidth announcement={isUserTheCurrentHuman ? announcement : undefined}>
      <Title>
        {isUserTheCurrentHuman ? (
          <Translate pt={<>Pergunte ao Alienígena!</>} en={<>Ask the Alien!</>} />
        ) : (
          <Translate pt={<>Perguntas ao Alienígena</>} en={<>Asking the Alien</>} />
        )}
      </Title>

      {isAlienBot && <BotPopupRule />}

      <PopoverRule content={<Status status={status} />} />

      <Instruction contained>
        {isUserTheCurrentHuman ? (
          <>
            <Translate
              pt={
                <>
                  Escolha um dos atributos que você deseja desvendar, então, selecione{' '}
                  <ItemsHighlight>1-5 itens</ItemsHighlight>
                  relacionados a esse atributo para perguntar o alienígena qual é o símbolo dele.
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
      </Instruction>

      <AlienContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} />
          <SignsKeyCard signs={signs} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <ViewIf condition={isUserTheCurrentHuman}>
          <HumanInquiry items={items} signs={signs} submitInquiry={onSubmitHumanInquiry} user={user} />
        </ViewIf>

        <ViewIf condition={!isUserTheCurrentHuman}>
          <Space className="boards-container" wrap>
            <ObjectsGrid items={items} showTypes={false} />
            <HumanSignBoard signs={signs} />
          </Space>
        </ViewIf>
      </HumanContent>

      <History
        inquiryHistory={inquiryHistory}
        requestHistory={requestHistory}
        players={players}
        items={items}
        isAlienBot={isAlienBot}
        signs={signs}
        showIntention={isDebugEnabled}
      />

      <DebugOnly>
        <SignsKeyCard signs={signs} />
      </DebugOnly>
    </Step>
  );
}
