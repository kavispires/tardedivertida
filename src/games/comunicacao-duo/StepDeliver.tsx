// Ant Design Resources
import { Flex, Tag } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { AlienKeyboard } from 'components/alien/AlienKeyboard';
import { AlienText } from 'components/alien/AlienText';
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle, TextHighlight } from 'components/text';
import { ViewIf, ViewOr } from 'components/views';
// Internal
import type { DeckEntry, HistoryEntry, SubmitDeliveryPayload, Summary } from './utils/types';
import { Board } from './components/Board';
import { SummaryBox } from './components/SummaryBox';
import { History } from './components/History';

type StepDeliverProps = {
  players: GamePlayers;
  user: GamePlayer;
  deckType: string;
  deck: DeckEntry[];
  status: string;
  history: HistoryEntry[];
  requester: GamePlayer;
  isTheRequester: boolean;
  summary: Summary;
  clueInputType: string;
  round: GameRound;
  onSubmitDelivery: (payload: SubmitDeliveryPayload) => void;
  onStopDelivery: () => void;
  clue: string;
  clueQuantity: number;
} & Pick<StepProps, 'announcement'>;

export function StepDeliver({
  players,
  user,
  announcement,
  deckType,
  deck,
  history,
  isTheRequester,
  summary,
  clueInputType,
  round,
  onSubmitDelivery,
  onStopDelivery,
  clue,
  clueQuantity,
}: StepDeliverProps) {
  const { isLoading } = useLoading();

  const onDeliver = (entry: DeckEntry) => {
    onSubmitDelivery({ delivery: entry.id });
  };

  const latestHistoryEntry = history[history.length - 1];

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle
        size="small"
        wait={isTheRequester}
      >
        {!isTheRequester ? (
          <Translate
            pt={<>Dê um item</>}
            en={<>Give an item</>}
          />
        ) : (
          <Translate
            pt={<>Aguarde o outro jogador responder com alguma coisa</>}
            en={<>Wait for the other player to answer with something</>}
          />
        )}
      </StepTitle>

      <RuleInstruction type={isTheRequester ? 'wait' : 'action'}>
        {isTheRequester ? (
          <>
            <Translate
              en="You asked for an item and the other player now must deliver at least one item. If they are correct, they can try another"
              pt="Você pediu um item e o outro jogador agora deve entregar pelo menos um deles. Se eles acertarem, podem tentar outro"
            />
            <br />
            <Translate
              en="After delivering at least one, the player may stop and skip to the next turn"
              pt="Depois de entregar pelo menos um, o jogador pode parar e pular para a próxima rodada"
            />
          </>
        ) : (
          <>
            <Translate
              en="The other player asked for an item and you must deliver at least one item. If you are correct, you can try another"
              pt="O outro jogador pediu um item e você deve entregar pelo menos um deles. Se você acertar, você pode tentar outro"
            />
            <br />
            <Translate
              en="Click on the item one by one to deliver them. After delivering at least one, you will able to stop and skip to the next turn"
              pt="Clique nos itens um por um para entregá-los. Depois de entregar pelo menos um, você poderá parar e pular para a próxima rodada"
            />
          </>
        )}
      </RuleInstruction>
      <ViewIf condition={latestHistoryEntry.deliverables?.length > 0 && !isTheRequester}>
        <RuleInstruction type="rule">
          {latestHistoryEntry.deliverables?.length >= clueQuantity ? (
            <Translate
              en="You have delivered all the items you needed in this round. You can stop now or try to deliver more"
              pt="Você entregou todos os itens que precisava nesta rodada. Você pode parar agora ou tentar entregar mais"
            />
          ) : (
            <Translate
              en={
                <>
                  You have delivered <Tag>{latestHistoryEntry.deliverables?.length}</Tag> things this round.
                  You may stop now and skip to the next turn
                </>
              }
              pt={
                <>
                  Você entregou <Tag>{latestHistoryEntry.deliverables?.length}</Tag> coisas essa rodada. Você
                  pode parar agora e pular para a próxima rodada
                </>
              }
            />
          )}
          <br />
          <SendButton
            onClick={onStopDelivery}
            type="default"
            loading={isLoading}
            block
          >
            <Translate
              en="Stop"
              pt="Parar"
            />
          </SendButton>
        </RuleInstruction>
      </ViewIf>

      <Flex
        gap={8}
        align="center"
        className="mb-4"
      >
        <div className="cd-clue-quantity">{clueQuantity}</div>
        <ViewOr condition={clueInputType === 'alien-keyboard'}>
          <AlienText
            value={clue}
            withTranslation
          />
          <TextHighlight style={{ fontSize: '1.5rem', background: 'white' }}>{clue}</TextHighlight>
        </ViewOr>
      </Flex>

      <Flex
        gap={8}
        align="center"
      >
        <Board
          deck={deck}
          deckType={deckType}
          userId={user.id}
          userSide={user.side}
          onClick={!isTheRequester ? onDeliver : undefined}
          disabled={isLoading}
        />
        <SummaryBox
          summary={summary}
          players={players}
          round={round}
        />
      </Flex>

      <ViewIf condition={clueInputType === 'alien-keyboard'}>
        <SpaceContainer>
          <AlienKeyboard
            value={''}
            onChange={() => {}}
            disabled
          />
        </SpaceContainer>
      </ViewIf>

      <History
        history={history}
        players={players}
        deck={deck}
        deckType={deckType}
        clueInputType={clueInputType}
        userSide={user.side}
      />
    </Step>
  );
}
