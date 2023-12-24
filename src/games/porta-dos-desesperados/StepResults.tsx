// Ant Design Resources
import { Space } from 'antd';
// Utils
import { OUTCOME, TOTAL_DOORS, TRAPS } from './utils/constants';
// Components
import { HostNextPhaseButton } from 'components/host';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Book } from './components/Book';
import { Corridor } from './components/Corridor';
import { CrystalHighlight, DoorHighlight } from './components/Highlights';
import { TrapPopupRule } from './components/RulesBlobs';
import { pluralize } from 'utils/helpers';

type StepResultsProps = {
  doors: CardId[];
  pages: CardId[];
  currentCorridor: number;
  trap: string;
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
      <Title size="medium" white>
        <OutcomeTitle outcome={outcome} />
      </Title>

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

      <OutcomeAlert outcome={outcome} />

      <Corridor doors={doors} trap={trap} players={players} answerDoorId={answerDoorId} disableTrap />

      <Space className="i-book-container">
        <Book>
          {Boolean(pages[0]) && <ImageCard imageId={pages[0]} cardWidth={140} />}
          {Boolean(pages[1]) && <ImageCard imageId={pages[1]} cardWidth={140} />}
          {Boolean(pages[2]) && <ImageCard imageId={pages[2]} cardWidth={140} />}
        </Book>
      </Space>

      <TrapPopupRule trap={trap} />

      <HostNextPhaseButton round={round} />
    </Step>
  );
}

type OutcomeProps = {
  outcome: string;
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

function OutcomeAlert({ outcome }: OutcomeProps) {
  if (outcome === OUTCOME.SUCCESS || outcome === OUTCOME.WIN) {
    return <></>;
  }

  return (
    <RuleInstruction type="alert">
      <Translate
        pt="Para a próxima rodada, as portas e armadilha continuarão as mesmas, mas a 'porta resposta' será aleatória."
        en="For the next round, the doors and trap will remain the same, but the 'door answer' will be randomized again."
      />
    </RuleInstruction>
  );
}
