import { useState } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useGlobalState } from '@hooks/useGlobalState';
import { useLoading } from '@hooks/useLoading';
// Components
import { DebugOnly } from '@components/debug/DebugOnly';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PopoverRule } from '@components/rules/PopoverRule';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type {
  InquiryHistoryEntry,
  OfferingsStatus,
  PhaseBasicState,
  RequestHistoryEntry,
  SubmitAlienRequestPayload,
} from './utils/types';
import { SignsKeyCard } from './components/SignsKeyCard';
import { AlienWritingBoard } from './components/AlienWritingBoard';
import { History } from './components/History';
import { Status } from './components/Status';
import { SelectableObjectsGrid } from './components/SelectableObjectsGrid';

type StepAlienRequestsProps = {
  players: GamePlayers;
  onSubmitAlienRequest: (payload: SubmitAlienRequestPayload) => void;
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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="O alienígena {player} deve pedir um item"
          en="Alien {player} must request an item"
          values={{
            player: <PlayerAvatarName player={alien} />,
          }}
        />
      </StepTitle>

      <PopoverRule content={<Status status={status} />} />

      <RuleInstruction type="action">
        <Translate
          pt="<strong>Selecione</strong> um dos objetos desejados (verde).
              <br />
              Então, <strong>descreva</strong> o objeto usando quantos símbolos você quiser.
              <br />
              Se você precisar inferir negação, coloque um traço horizontal em cima do <overline>símbolo</overline>.
              <br />
              Se você precisa inferir ênfase, coloque um traço horizontal embaixo do <underline>símbolo</underline>."
          en="<strong>Select</strong> one of the desired objects (green).
              <br />
              Then, <strong>describe</strong> the object using as many symbols you wish.
              <br />
              If you need to infer negation or the contrary, draw an horizontal line on top of the <overline>symbol</overline>.
              <br />
              If you need to infer emphasis, draw an horizontal line below the <underline>symbol</underline>."
          values={{
            overline: (children) => <span style={{ textDecoration: 'overline' }}>{children}</span>,
            underline: (children) => <span style={{ textDecoration: 'underline' }}>{children}</span>,
          }}
        />
      </RuleInstruction>

      <AlienWritingBoard
        onSubmit={(alienRequest) => onSubmitAlienRequest({ alienRequest, intention })}
        disabled={user.ready || isLoading || !intention}
      />

      <Space
        className="boards-container"
        wrap
      >
        <SelectableObjectsGrid
          items={items}
          showTypes={isUserAlien}
          user={user}
          selectedObjects={{ [intention]: true }}
          selectObject={(itemId) => setIntention(itemId)}
          isAlienRequest
          status={status}
        />
        <SignsKeyCard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          inquiryHistory={inquiryHistory}
        />
      </Space>

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
        <SignsKeyCard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          inquiryHistory={inquiryHistory}
        />
      </DebugOnly>
    </Step>
  );
}
