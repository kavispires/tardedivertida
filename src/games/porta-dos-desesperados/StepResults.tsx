// Ant Design Resources
import { Space } from 'antd';
// Utils
import { OUTCOME, TOTAL_DOORS, TRAPS } from './utils/constants';
// Components
import { AdminNextPhaseButton } from 'components/admin';
import { ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Book } from './components/Book';
import { Corridor } from './components/Corridor';
import { CrystalHighlight, DoorHighlight } from './components/Highlights';
import { TrapPopupRule } from './components/RulesBlobs';

type StepResultsProps = {
  doors: CardId[];
  pages: CardId[];
  currentCorridor: number;
  trap: string;
  players: GamePlayers;
  round: GameRound;
  outcome: string;
  answerDoorId: string;
  isLastRound?: boolean;
  magic: number;
  usedMagic: number;
};

export function StepResults({
  doors,
  pages,
  currentCorridor,
  trap,
  players,
  round,
  isLastRound,
  answerDoorId,
  outcome,
  magic,
  usedMagic,
}: StepResultsProps) {
  const doorsLeft = TOTAL_DOORS - currentCorridor + (outcome === OUTCOME.SUCCESS ? 0 : 1);
  return (
    <Step fullWidth>
      <Title size="medium" white>
        <OutcomeTitle outcome={outcome} />
      </Title>

      <Instruction contained>
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
              Vocês usaram <CrystalHighlight negative>{usedMagic}</CrystalHighlight> e têm{' '}
              <CrystalHighlight>{magic}</CrystalHighlight> sobrando.
            </>
          }
          en={
            <>
              You used <CrystalHighlight negative>{usedMagic}</CrystalHighlight> but still have{' '}
              <CrystalHighlight>{magic}</CrystalHighlight> remaining.
            </>
          }
        />
        <br />
        <Translate
          pt={
            <>
              E <DoorHighlight>{doorsLeft}</DoorHighlight> portas pra encontrar a saída.
            </>
          }
          en={
            <>
              And <DoorHighlight>{doorsLeft}</DoorHighlight> doors to find the exit.
            </>
          }
        />
      </Instruction>

      <Corridor doors={doors} trap={trap} players={players} answerDoorId={answerDoorId} />

      <Space className="i-book-container">
        <Book>
          {Boolean(pages[0]) && <ImageCard imageId={pages[0]} cardWidth={140} />}
          {Boolean(pages[1]) && <ImageCard imageId={pages[1]} cardWidth={140} />}
          {Boolean(pages[2]) && <ImageCard imageId={pages[2]} cardWidth={140} />}
        </Book>
      </Space>

      <TrapPopupRule trap={trap} />

      <AdminNextPhaseButton round={round} lastRound={isLastRound} />
    </Step>
  );
}

type OutcomeProps = {
  outcome: string;
};

export function OutcomeTitle({ outcome }: OutcomeProps) {
  if (outcome === OUTCOME.SUCCESS || outcome === OUTCOME.WIN) {
    return <Translate pt="Porta Correta!" en="Correct Door!" />;
  }

  return <Translate pt="Porta Errada" en="Wrong Door" />;
}

export function OutcomeInstruction({ outcome }: OutcomeProps) {
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
