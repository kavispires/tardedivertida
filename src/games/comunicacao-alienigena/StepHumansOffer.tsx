// Ant Design Resources
import { Space } from 'antd';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { AlienContent, HumanContent } from './components/Content';
import { HumanOffering } from './components/HumanOffering';
import { History } from './components/History';
import { PopoverRule } from 'components/rules';
import { Status } from './components/Status';
import { AlienViewBoard } from './components/AlienViewBoard';

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
} & AnnouncementProps;

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
}: StepHumansOfferProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt={<>Ofereça um objeto</>} en={<>Offer an object</>} />
      </Title>

      <PopoverRule content={<Status status={status} />} />

      <Instruction contained>
        <Translate
          pt={
            <>
              O(A) alienígena <AvatarName player={alien} /> fez esse pedido. Você consegue decifrar qual
              objeto ele(a) quer?
            </>
          }
          en={
            <>
              The alien <AvatarName player={alien} /> made this request. Can you decipher what object they
              want?
            </>
          }
        />
      </Instruction>

      <AlienContent user={user}>
        <Instruction contained>
          <Translate
            pt={<>Aguarde enquanto os humanos escolhem um objeto para te oferecer.</>}
            en={<>Wait while the humans choose an object to offer.</>}
          />
        </Instruction>
      </AlienContent>

      <AlienViewBoard request={requestHistory[0].request} />

      <AlienContent user={user}>
        <Space className="space-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} />
          <SignsKeyCard signs={signs} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="space-container" wrap>
          <HumanOffering
            signs={signs}
            items={items}
            submitOffer={onSubmitOffering}
            user={user}
            status={status}
          />
        </Space>
      </HumanContent>

      <History inquiryHistory={inquiryHistory} requestHistory={requestHistory} players={players} />
    </Step>
  );
}
