// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Space } from 'antd';
import { AvatarName } from 'components/avatars';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';

import { AlienWritingBoard } from './components/AlienWritingBoard';
import { AlienContent, HumanContent } from './components/Content';
import { History } from './components/History';
import { PopoverRule } from 'components/rules';
import { Status } from './components/Status';

type StepAlienRequestsProps = {
  players: GamePlayers;
  onSubmitAlienRequest: GenericFunction;
  user: GamePlayer;
  alien: GamePlayer;
  isUserAlien: boolean;
  items: Item[];
  signs: Sign[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
} & AnnouncementProps;

export function StepAlienRequests({
  players,
  announcement,
  user,
  onSubmitAlienRequest,

  items,
  signs,
  alien,
  isUserAlien,
  requestHistory,
  inquiryHistory,
  status,
}: StepAlienRequestsProps) {
  const { isLoading } = useLoading();

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={
            <>
              Alienígena <AvatarName player={alien} /> pede um objeto
            </>
          }
          en={
            <>
              Alien <AvatarName player={alien} /> requests an object
            </>
          }
        />
      </Title>

      <PopoverRule content={<Status status={status} />} />

      <HumanContent user={user}>
        <Instruction contained>
          <Translate
            pt={
              <>
                Aguarde enquanto <AvatarName player={alien} /> escreve o objeto que ele(a) quer.
              </>
            }
            en={
              <>
                Wait while <AvatarName player={alien} /> describes a desired object.
              </>
            }
          />
        </Instruction>
      </HumanContent>

      <AlienContent user={user}>
        <Instruction contained>
          <Translate
            pt={
              <>
                Descreva um dos objetos desejados (verde) usando quantos símbolos você quiser. <br />
                Se você precisar inferir negação, coloque um traço horizontal em cima do símbolo.
              </>
            }
            en={
              <>
                Describe one of your desired objects (green) using as many symbols you wish. <br />
                If you need to infer negation or the contrary, draw an horizontal line on top of the symbol.
              </>
            }
          />
        </Instruction>
        <AlienWritingBoard
          onSubmit={(alienRequest) => onSubmitAlienRequest({ alienRequest })}
          disabled={user.ready || isLoading}
        />
      </AlienContent>

      <AlienContent user={user}>
        <Space className="space-container" wrap>
          <ObjectsGrid items={items} showTypes={isUserAlien} />
          <SignsKeyCard signs={signs} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="space-container" wrap>
          <ObjectsGrid items={items} />
          <HumanSignBoard signs={signs} />
        </Space>
      </HumanContent>

      <History
        inquiryHistory={inquiryHistory}
        requestHistory={requestHistory}
        players={players}
        items={items}
      />
    </Step>
  );
}
