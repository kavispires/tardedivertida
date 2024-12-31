// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import type { DeckEntry, HistoryEntry, Summary } from './utils/types';
import { Board } from './components/Board';
import { AlienKeyboard } from 'components/alien/AlienKeyboard';
import { AlienText } from 'components/alien/AlienText';
import { useMemo } from 'react';
import { Flex, Space } from 'antd';
import { ViewIf } from 'components/views';
import { STATUS } from './utils/constants';
import { SummaryBox } from './components/SummaryBox';
import type { GameRound } from 'types/game';
import { HostNextPhaseButton } from 'components/host';
import { PHASES } from 'utils/phases';

type StepDeliverProps = {
  players: GamePlayers;
  user: GamePlayer;
  deckType: string;
  deck: DeckEntry[];
  status: string;
  history: HistoryEntry[];
  summary: Summary;
  clueInputType: string;
  round: GameRound;
  clue: string;
  clueQuantity: number;
  entryIdToAnimate: string | null;
  nextPhase: string;
} & Pick<StepProps, 'announcement'>;

export function StepVerification({
  players,
  user,
  deckType,
  deck,
  status,
  history,
  summary,
  clueInputType,
  round,
  clue,
  clueQuantity,
  entryIdToAnimate,
  nextPhase,
}: StepDeliverProps) {
  const results = useMemo(() => {
    const latestHistoryEntry = history[history.length - 1];
    const latestDeliverableId = latestHistoryEntry.deliverables[latestHistoryEntry.deliverables.length - 1];
    const latestDeliverable = deck.find((entry) => entry.id === latestDeliverableId);

    // Delivered nothing / skipped
    if (status === STATUS.CONTINUE && !entryIdToAnimate) {
      return {
        en: (
          <>
            <strong>Skip!</strong> All done for this round, let's try another clue
          </>
        ),
        pt: (
          <>
            <strong>Passa!</strong> Tudo certo para esta rodada, vamos tentar outra dica
          </>
        ),
      };
    }

    // All delivered
    if (status === STATUS.WIN) {
      return {
        en: <>All items have been found!</>,
        pt: <>Todos os itens foram encontrados!</>,
      };
    }

    // Delivered taboo
    if (status === STATUS.LOSE) {
      return {
        en: (
          <>
            Nooooo, a <strong>taboo</strong> item has been selected!
          </>
        ),
        pt: (
          <>
            Nãããão, um item <strong>taboo</strong> foi selecionado!
          </>
        ),
      };
    }

    // Delivered incorrectly
    if (status === STATUS.CONTINUE) {
      if (nextPhase === PHASES.COMUNICACAO_DUO.ASKING_FOR_SOMETHING) {
        return {
          en: (
            <>
              <strong>Blank!</strong> All done fir this round, let's try another clue.
            </>
          ),
          pt: (
            <>
              <strong>Bege!</strong> Vamos para a próxima rodada.
            </>
          ),
        };
      }
    }

    // Delivered correct
    return {
      en: (
        <>
          <strong>Correct!</strong> Want to try one more item?
        </>
      ),
      pt: (
        <>
          <strong>Correto!</strong> Quer tentar outro item?
        </>
      ),
    };
  }, [history, status, deck, entryIdToAnimate, nextPhase]);

  return (
    <Step fullWidth>
      <Title size="small">
        <Translate en="Results" pt="Resultado" />
      </Title>

      <RuleInstruction type="event">
        <Translate en={results.en} pt={results.pt} />
      </RuleInstruction>

      <Flex gap={8} align="center" className="mb-4">
        <div className="cd-clue-quantity">{clueQuantity}</div>
        <AlienText value={clue} withTranslation />
      </Flex>

      <Flex gap={8} align="center">
        <Board
          deck={deck}
          deckType={deckType}
          userId={user.id}
          userSide={user.side}
          animateEntries={entryIdToAnimate ? [entryIdToAnimate] : []}
        />
        <SummaryBox summary={summary} players={players} round={round} />
      </Flex>

      <ViewIf condition={clueInputType === 'alien-keyboard'}>
        <Space className="space-container" direction="vertical">
          <AlienKeyboard value={''} onChange={() => {}} disabled />
        </Space>
      </ViewIf>

      <HostNextPhaseButton round={round} autoTriggerTime={7} />
    </Step>
  );
}
