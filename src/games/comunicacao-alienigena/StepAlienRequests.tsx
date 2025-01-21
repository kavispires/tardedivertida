import { useState } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLoading } from 'hooks/useLoading';
// Components
import { AvatarName } from 'components/avatars';
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type {
  InquiryHistoryEntry,
  OfferingsStatus,
  PhaseBasicState,
  RequestHistoryEntry,
} from './utils/types';
import { ObjectsGrid } from './components/ObjectsGrid';
import { SignsKeyCard } from './components/SignsKeyCard';
import { HumanSignBoard } from './components/HumanSignBoard';
import { AlienWritingBoard } from './components/AlienWritingBoard';
import { AlienContent, HumanContent } from './components/Content';
import { History } from './components/History';
import { Status } from './components/Status';
import { SelectableObjectsGrid } from './components/SelectableObjectsGrid';

type StepAlienRequestsProps = {
  players: GamePlayers;
  onSubmitAlienRequest: GenericFunction;
  user: GamePlayer;
  alien: GamePlayer;
  isUserAlien: boolean;
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  status: OfferingsStatus;
  requestHistory: RequestHistoryEntry[];
  inquiryHistory: InquiryHistoryEntry[];
  debugMode: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepAlienRequests({
  players,
  announcement,
  user,
  onSubmitAlienRequest,
  items,
  attributes,
  alien,
  isUserAlien,
  requestHistory,
  inquiryHistory,
  status,
  startingAttributesIds,
  debugMode,
}: StepAlienRequestsProps) {
  const { isLoading } = useLoading();
  const [intention, setIntention] = useState<string>('');
  const [isDebugEnabled] = useGlobalState('isDebugEnabled');

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
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
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      <HumanContent user={user}>
        <RuleInstruction type="wait">
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
        </RuleInstruction>
      </HumanContent>

      <AlienContent user={user}>
        <RuleInstruction type="action">
          <Translate
            pt={
              <>
                <strong>Selecione</strong> um dos objetos desejados (verde).
                <br />
                Então, <strong>descreva</strong> o objeto usando quantos símbolos você quiser.
                <br />
                Se você precisar inferir negação, coloque um traço horizontal em cima do{' '}
                <span style={{ textDecoration: 'overline' }}>símbolo</span>.
                <br />
                Se você precisa inferir ênfase, coloque um traço horizontal embaixo do{' '}
                <span style={{ textDecoration: 'underline' }}>símbolo</span>.
              </>
            }
            en={
              <>
                <strong>Select</strong> one of the desired objects (green).
                <br />
                Then, <strong>describe</strong> the object using as many symbols you wish.
                <br />
                If you need to infer negation or the contrary, draw an horizontal line on top of the{' '}
                <span style={{ textDecoration: 'overline' }}>symbol</span>.
                <br />
                If you need to infer emphasis, draw an horizontal line below the{' '}
                <span style={{ textDecoration: 'underline' }}>symbol</span>.
              </>
            }
          />
        </RuleInstruction>

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
            isAlienRequest
            status={status}
          />
          <SignsKeyCard attributes={attributes} startingAttributesIds={startingAttributesIds} />
        </Space>
      </AlienContent>

      <HumanContent user={user}>
        <Space className="boards-container" wrap>
          <ObjectsGrid items={items} status={status} />
          <HumanSignBoard attributes={attributes} startingAttributesIds={startingAttributesIds} />
        </Space>
      </HumanContent>

      <History
        inquiryHistory={inquiryHistory}
        requestHistory={requestHistory}
        players={players}
        items={items}
        isAlienBot={false}
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
