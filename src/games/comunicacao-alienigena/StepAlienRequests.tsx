import { useState } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { AlienWritingBoard } from './components/AlienWritingBoard';
import { AlienContent, HumanContent } from './components/Content';
import { History } from './components/History';
import { PopoverRule } from 'components/rules';
import { Status } from './components/Status';
import { SelectableObjectsGrid } from './components/SelectableObjectsGrid';

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
  const [intention, setIntention] = useState<string>('');

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={
            <>
              Alienígena <AvatarName player={alien} /> pede um item
            </>
          }
          en={
            <>
              Alien <AvatarName player={alien} /> requests an item
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
                <strong>Selecione</strong> um dos objetos desejados (verde).
                <br />
                Então, descreva o objeto usando quantos símbolos você quiser.
                <br />
                Se você precisar inferir negação, coloque um traço horizontal em cima do símbolo.
                <br />
                Se você precisa inferir ênfase, coloque um traço horizontal embaixo do símbolo.
              </>
            }
            en={
              <>
                <strong>Select</strong> one of the desired objects (green).
                <br />
                Then, describe the object using as many symbols you wish.
                <br />
                If you need to infer negation or the contrary, draw an horizontal line on top of the symbol.
                <br />
                If you need to infer emphasis, draw an horizontal line below the symbol.
              </>
            }
          />
        </Instruction>

        <AlienWritingBoard
          onSubmit={(alienRequest) => onSubmitAlienRequest({ alienRequest, intention })}
          disabled={user.ready || isLoading || !intention}
        />
      </AlienContent>

      <AlienContent user={user}>
        <Space className="boards-container" wrap>
          <SelectableObjectsGrid
            items={items}
            showTypes={isUserAlien}
            user={user}
            selectedObjects={{ [intention]: true }}
            selectObject={(itemId) => setIntention(itemId)}
          />
          <SignsKeyCard signs={signs} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} />
          <HumanSignBoard signs={signs} />
        </Space>
      </HumanContent>

      <History
        inquiryHistory={inquiryHistory}
        requestHistory={requestHistory}
        players={players}
        items={items}
        isAlienBot={false}
        signs={signs}
      />
    </Step>
  );
}
