// Hooks
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Space } from 'antd';
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
}: StepHumanAsksProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        {isUserTheCurrentHuman ? (
          <Translate pt={<>Pergunte ao Alienígena!</>} en={<>Ask the Alien!</>} />
        ) : (
          <Translate pt={<>Perguntas ao Alienígena</>} en={<>Asking the Alien</>} />
        )}
      </Title>

      <PopoverRule content={<Status status={status} />} />

      <Instruction contained>
        {isUserTheCurrentHuman ? (
          <>
            <Translate
              pt={
                <>
                  Escolha um dos atributos que você deseja desvendar, então, selecione 1-5 objetos
                  relacionados a esse atributo para perguntar o alienígena qual é o símbolo dele.
                </>
              }
              en={
                <>
                  Choose one of the atributes you want to unveil, then select 1-5 objects below to ask the
                  alien what its symbol.
                </>
              }
            />
          </>
        ) : (
          <>
            <Translate
              pt={
                <>
                  Aguarde enquanto <AvatarName player={currentHuman} /> seleciona 1-5 objetos para perguntar
                  ao alienígena <AvatarName player={alien} /> qual o símbolo relacionado a eles.
                </>
              }
              en={
                <>
                  Please wait wile <AvatarName player={currentHuman} /> selects 1-5 objects to ask the alien{' '}
                  <AvatarName player={alien} /> what symbol is related to them.
                </>
              }
            />
          </>
        )}
      </Instruction>

      <AlienContent user={user}>
        <Space className="space-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} />
          <SignsKeyCard signs={signs} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <ViewIf isVisible={isUserTheCurrentHuman}>
          <HumanInquiry items={items} signs={signs} submitInquiry={onSubmitHumanInquiry} user={user} />
        </ViewIf>

        <ViewIf isVisible={!isUserTheCurrentHuman}>
          <Space className="space-container" wrap>
            <ObjectsGrid items={items} showTypes={false} />
            <HumanSignBoard signs={signs} />
          </Space>
        </ViewIf>
      </HumanContent>

      <History inquiryHistory={inquiryHistory} requestHistory={requestHistory} players={players} />
    </Step>
  );
}
