// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Utils
import { LETTERS } from 'utils/constants';
import { pluralize } from 'utils/helpers';
// Components
import { HostNextPhaseButton } from 'components/host';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import { OUTCOME, TOTAL_DOORS, TRAPS } from './utils/constants';
import type { TrapEntry } from './utils/types';
import { Book } from './components/Book';
import { Corridor } from './components/Corridor';
import { CrystalHighlight, DoorHighlight } from './components/Highlights';
import { TrapPopupRule } from './components/RulesBlobs';

type StepResultsProps = {
  doors: CardId[];
  pages: CardId[];
  currentCorridor: number;
  trap: string;
  trapEntry: TrapEntry | null;
  players: GamePlayers;
  round: GameRound;
  outcome: string;
  answerDoorId: string;
  magic: number;
  usedMagic: number;
};

export function StepResults({
  doors,
  pages,
  currentCorridor,
  trap,
  trapEntry,
  players,
  round,
  answerDoorId,
  outcome,
  magic,
  usedMagic,
}: StepResultsProps) {
  const doorsLeft = TOTAL_DOORS - currentCorridor + (outcome === OUTCOME.SUCCESS ? 0 : 1);
  return (
    <Step fullWidth>
      <StepTitle>
        <OutcomeTitle outcome={outcome} />
      </StepTitle>

      <RuleInstruction type="event">
        <OutcomeInstruction outcome={outcome} />

        {trap === TRAPS.DOUBLE_MAGIC && (
          <>
            <br />
            <strong>
              <Translate pt="Essa rodada usou o dobro de mágica!!!" en="This round used double magic!" />
            </strong>
          </>
        )}
        <br />
        <Translate
          pt={
            <>
              Vocês usaram <CrystalHighlight type="negative">{usedMagic}</CrystalHighlight> e têm{' '}
              <CrystalHighlight>{magic}</CrystalHighlight> sobrando.
            </>
          }
          en={
            <>
              You used <CrystalHighlight type="negative">{usedMagic}</CrystalHighlight> but still have{' '}
              <CrystalHighlight>{magic}</CrystalHighlight> remaining.
            </>
          }
        />
        <br />
        <Translate
          pt={
            <>
              E faltam <DoorHighlight>{doorsLeft}</DoorHighlight> portas pra encontrar a saída.
            </>
          }
          en={
            <>
              And there {pluralize(doorsLeft, 'is', 'are')} <DoorHighlight>{doorsLeft}</DoorHighlight> doors
              left to find the exit.
            </>
          }
        />
      </RuleInstruction>

      <OutcomeAlert outcome={outcome} doorIndex={doors.indexOf(answerDoorId)} />

      <Corridor doors={doors} trap={trap} players={players} answerDoorId={answerDoorId} disableTrap />

      <Space className="i-book-container">
        <Book>
          {Boolean(pages[0]) && <ImageCard id={pages[0]} cardWidth={140} />}
          {Boolean(pages[1]) && <ImageCard id={pages[1]} cardWidth={140} />}
          {Boolean(pages[2]) && <ImageCard id={pages[2]} cardWidth={140} />}
        </Book>
      </Space>

      <TrapPopupRule trapEntry={trapEntry} />

      <HostNextPhaseButton round={round} />
    </Step>
  );
}

type OutcomeProps = {
  outcome: string;
  doorIndex?: number;
};

function OutcomeTitle({ outcome }: OutcomeProps) {
  if (outcome === OUTCOME.SUCCESS || outcome === OUTCOME.WIN) {
    return <Translate pt="Porta Correta!" en="Correct Door!" />;
  }

  return <Translate pt="Porta Errada" en="Wrong Door" />;
}

function OutcomeInstruction({ outcome }: OutcomeProps) {
  if (outcome === OUTCOME.SUCCESS || outcome === OUTCOME.WIN) {
    return (
      <Translate
        pt="Pelo menos um jogador entrou na porta correta. Parabéns!"
        en="At least one player entered the correct door. Good job!"
      />
    );
  }

  return (
    <Translate pt="Nenhum jogador entrou na porta correta." en="No player has entered the correct door." />
  );
}

function OutcomeAlert({ outcome, doorIndex = 0 }: OutcomeProps) {
  if (outcome === OUTCOME.SUCCESS || outcome === OUTCOME.WIN) {
    return null;
  }

  return (
    <RuleInstruction type="alert">
      <Translate
        pt={
          <>
            Para a próxima rodada, a <DoorHighlight>porta {LETTERS[doorIndex]}</DoorHighlight> será removida,
            as outras portas e a armadilha continuam as mesmas, mas uma nova <strong>resposta</strong> será
            sorteada aleatoriamente.
          </>
        }
        en={
          <>
            For the next round, <DoorHighlight>door {LETTERS[doorIndex]}</DoorHighlight> will be removed, the
            other doors and the trap remain the same, but a new <strong>answer</strong> will be randomly
            drawn.
          </>
        }
      />
    </RuleInstruction>
  );
}
