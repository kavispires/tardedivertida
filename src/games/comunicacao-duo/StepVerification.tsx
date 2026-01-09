import { useMemo } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
// Components
import { AlienKeyboard } from 'components/alien/AlienKeyboard';
import { AlienText } from 'components/alien/AlienText';
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle, TextHighlight } from 'components/text';
import { ViewIf, ViewOr } from 'components/views';
// Internal
import type { DeckEntry, HistoryEntry, Summary } from './utils/types';
import { COMUNICACAO_DUO_PHASES, STATUS } from './utils/constants';
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
  summary: Summary;
  clueInputType: string;
  round: GameRound;
  clue: string;
  clueQuantity: number;
  entryIdToAnimate: string | null;
  nextPhase: string;
} & Pick<StepProps, 'announcement'>;

export function StepVerification({
  announcement,
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
            Nooooo, a <TextHighlight>taboo</TextHighlight> item has been selected!
          </>
        ),
        pt: (
          <>
            Nãããão, um item <TextHighlight>taboo</TextHighlight> foi selecionado!
          </>
        ),
      };
    }

    // Delivered incorrectly
    if (status === STATUS.CONTINUE) {
      if (nextPhase === COMUNICACAO_DUO_PHASES.ASKING_FOR_SOMETHING) {
        return {
          en: (
            <>
              <TextHighlight>Neutral!</TextHighlight> All done fir this round, let's try another clue.
            </>
          ),
          pt: (
            <>
              <TextHighlight>Neutro!</TextHighlight> Vamos para a próxima rodada.
            </>
          ),
        };
      }
    }

    // Delivered correct
    return {
      en: (
        <>
          <TextHighlight>Correct!</TextHighlight> Want to try one more item?
        </>
      ),
      pt: (
        <>
          <TextHighlight>Correto!</TextHighlight> Quer tentar outro item?
        </>
      ),
    };
  }, [status, entryIdToAnimate, nextPhase]);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle size="small">
        <Translate
          en="Results"
          pt="Resultado"
        />
      </StepTitle>

      <RuleInstruction type="event">
        <Translate
          en={results.en}
          pt={results.pt}
        />
      </RuleInstruction>

      <HostNextPhaseButton
        round={round}
        autoTriggerTime={status !== STATUS.CONTINUE ? 5 : 2}
        withWaitingTimeBar
      />

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
          animateEntries={entryIdToAnimate ? [entryIdToAnimate] : []}
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
