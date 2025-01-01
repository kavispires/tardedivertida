import { useState } from 'react';
// Ant Design Resources
import { Button, Flex, InputNumber, Space } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { AlienKeyboard } from 'components/alien/AlienKeyboard';
import { AlienText } from 'components/alien/AlienText';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { DeckEntry, HistoryEntry, SubmitRequestPayload, Summary } from './utils/types';
import { STATUS } from './utils/constants';
import { Board } from './components/Board';
import { SummaryBox } from './components/SummaryBox';
import { History } from './components/History';

type StepAskProps = {
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
  onSubmitRequest: (payload: SubmitRequestPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepAsk({
  players,
  user,
  announcement,
  deckType,
  deck,
  status,
  history,
  requester,
  isTheRequester,
  summary,
  clueInputType,
  round,
  onSubmitRequest,
}: StepAskProps) {
  const { isLoading } = useLoading();
  const [sentence, setSentence] = useState<string>('');
  const [clueQuantity, setQuantity] = useState<number>(1);

  const onSubmit = () => {
    onSubmitRequest({ clue: sentence, clueQuantity });
  };

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle size="small" wait={isTheRequester}>
        {isTheRequester ? (
          <Translate pt={<>Peça algo!</>} en={<>Ask for something!</>} />
        ) : (
          <Translate
            pt={
              <>
                Aguarde <AvatarName player={requester} /> pedir algo
              </>
            }
            en={
              <>
                Wait for <AvatarName player={requester} /> to ask for something
              </>
            }
          />
        )}
      </StepTitle>

      <RuleInstruction type="rule">
        {status === STATUS.IDLE ? (
          <Translate
            en="It's the first round, so any of you can give the first clue"
            pt="É a primeira rodada, então qualquer um de vocês pode dar a primeira dica"
          />
        ) : (
          <Translate
            en="Players alternate asking for items, unless one player is done asking for all of their items"
            pt="Os jogadores alternam pedindo itens, a menos que um jogador tenha terminado de pedir todos os seus itens"
          />
        )}
      </RuleInstruction>

      <Flex gap={8} align="center">
        <Board deck={deck} deckType={deckType} userId={user.id} userSide={user.side} />
        <SummaryBox summary={summary} players={players} round={round} />
      </Flex>

      <ViewIf condition={clueInputType === 'alien-keyboard'}>
        <ViewIf condition={isTheRequester}>
          <RuleInstruction type="action">
            <Translate
              en="Use the keyboard below to type your request and add the number of items you want"
              pt="Use o teclado abaixo para digitar seu pedido e adicione o número de itens que deseja"
            />
          </RuleInstruction>
        </ViewIf>

        <Space className="space-container" direction="vertical">
          <ViewIf condition={isTheRequester}>
            <Flex gap={8} align="center">
              <AlienText value={sentence} withTranslation />
              <strong>
                <Translate en="Quantity" pt="Quantidade" />:
              </strong>
              <InputNumber
                value={clueQuantity}
                onChange={(v) => setQuantity(v ?? 1)}
                min={0}
                max={6}
                size="large"
              />
              <Button type="primary" size="large" loading={isLoading} disabled={!sentence} onClick={onSubmit}>
                <Translate en="Submit" pt="Enviar" />
              </Button>
            </Flex>
          </ViewIf>
          <AlienKeyboard value={sentence} onChange={setSentence} disabled={!isTheRequester || user.ready} />
        </Space>
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
