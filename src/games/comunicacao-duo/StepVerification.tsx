import { useMemo } from 'react';
// Ant Design Resources
import { Flex, Space } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { AlienKeyboard } from 'components/alien/AlienKeyboard';
import { AlienText } from 'components/alien/AlienText';
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { DeckEntry, HistoryEntry, Summary } from './utils/types';
import { STATUS } from './utils/constants';
import { Board } from './components/Board';
import { SummaryBox } from './components/SummaryBox';
import { History } from './components/History';
// Hooks

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
  }, [status, entryIdToAnimate, nextPhase]);

  return (
    <Step fullWidth>
      <StepTitle size="small">
        <Translate en="Results" pt="Resultado" />
      </StepTitle>

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

      <History
        history={history}
        players={players}
        deck={deck}
        deckType={deckType}
        clueInputType={clueInputType}
        userSide={user.side}
      />

      <HostNextPhaseButton round={round} autoTriggerTime={3} />
    </Step>
  );
}
