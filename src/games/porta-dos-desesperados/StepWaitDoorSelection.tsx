// Ant Design Resources
// Hooks
// Utils
// Components
import { Space } from 'antd';
import { ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { useMemo } from 'react';
import { NOOP } from 'utils/constants';
import { PHASES } from 'utils/phases';
import { Book } from './components/Book';
import { Corridor } from './components/Corridor';
import { CrystalHighlight, DoorHighlight, TimeHighlight } from './components/Highlights';
import { BotPopupRule, TrapPopupRule } from './components/RulesBlobs';
import { SandTimer } from './components/SandTimer';
import { ROUND_DURATION, TOTAL_DOORS, TRAPS } from './utils/constants';
import { shouldAnnounceTrap } from './utils/helpers';

type StepWaitDoorSelectionProps = {
  doors: CardId[];
  pages: CardId[];
  currentCorridor: number;
  trap: string;
  players: GamePlayers;
  answerDoorId: CardId;
  magic: number;
  botEnabled?: boolean;
};

export function StepWaitDoorSelection({
  doors,
  pages,
  currentCorridor,
  trap,
  players,
  answerDoorId,
  magic,
  botEnabled,
}: StepWaitDoorSelectionProps) {
  const showTrap = useMemo(() => shouldAnnounceTrap(trap, PHASES.PORTA_DOS_DESESPERADOS.DOOR_CHOICE), [trap]);

  return (
    <Step fullWidth>
      <Title size="medium" white>
        <Translate
          pt="Aguarde enquanto os outros jogadores selecionam as portas"
          en="Wait while the players select doors"
        />
      </Title>

      {showTrap && <TrapPopupRule trap={trap} />}

      {botEnabled && <BotPopupRule />}

      <Instruction contained className="i-sand-timer-container">
        <Translate
          pt={
            <>
              Silêncio e poker face!
              <br />
              Eles tem <TimeHighlight>{ROUND_DURATION}</TimeHighlight> minutos para decidir qual(quais)
              porta(s) entrar.
              <br />
              Cada porta visitada custará{' '}
              <CrystalHighlight>{trap === TRAPS.DOUBLE_MAGIC ? 2 : 1}</CrystalHighlight> cristal, portanto,
              escolha sabiamente.
              <br />
              Vocês tem <CrystalHighlight>{magic}</CrystalHighlight> cristais sobrando e{' '}
              <DoorHighlight>{TOTAL_DOORS - currentCorridor + 1}</DoorHighlight> portas para achar a saída.
            </>
          }
          en={
            <>
              Silence and poker face!
              <br />
              You have <TimeHighlight>{ROUND_DURATION}</TimeHighlight> minutes to decide what door(s) to
              visit.
              <br />
              Each door a player visits costs{' '}
              <CrystalHighlight>{trap === TRAPS.DOUBLE_MAGIC ? 2 : 1}</CrystalHighlight> crystal, so choose
              wisely.
              <br />
              You all have <CrystalHighlight>{magic}</CrystalHighlight> remaining crystals and{' '}
              <DoorHighlight>{TOTAL_DOORS - currentCorridor + 1}</DoorHighlight> doors to find the exit.
            </>
          }
        />

        <SandTimer
          trap={trap}
          doors={doors}
          onDisableButtons={NOOP}
          onSubmitDoor={NOOP}
          onMakeReady={NOOP}
          user={{ doorId: 'ABC', ready: true }}
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
    </Step>
  );
}
