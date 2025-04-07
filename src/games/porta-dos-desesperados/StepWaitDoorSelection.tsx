import { useMemo } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { NOOP, PLACEHOLDER_PLAYER } from 'utils/constants';
// Components
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import { shouldAnnounceTrap } from './utils/helpers';
import { PORTA_DOS_DESESPERADOS_PHASES, ROUND_DURATION, TOTAL_DOORS, TRAPS } from './utils/constants';
import { Book } from './components/Book';
import { Corridor } from './components/Corridor';
import { CrystalHighlight, DoorHighlight, TimeHighlight } from './components/Highlights';
import { BotPopupRule, TrapPopupRule } from './components/RulesBlobs';
import { SandTimer } from './components/SandTimer';

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
  const showTrap = useMemo(() => shouldAnnounceTrap(trap, PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE), [trap]);

  return (
    <Step fullWidth>
      <StepTitle>
        <Translate
          pt="Aguarde enquanto os outros jogadores selecionam as portas"
          en="Wait while the players select doors"
        />
      </StepTitle>

      {showTrap && <TrapPopupRule trap={trap} />}

      {botEnabled && <BotPopupRule />}

      <RuleInstruction type="rule" className="i-sand-timer-container">
        <Translate
          pt={
            <>
              Silêncio e poker face!
              <br />
              Eles tem{' '}
              <TimeHighlight>{trap === TRAPS.HALF_TIME ? ROUND_DURATION / 2 : ROUND_DURATION}</TimeHighlight>{' '}
              minutos para decidir qual(quais) porta(s) entrar.
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
              You have{' '}
              <TimeHighlight>{trap === TRAPS.HALF_TIME ? ROUND_DURATION / 2 : ROUND_DURATION}</TimeHighlight>{' '}
              minutes to decide what door(s) to visit.
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
          user={{ ...PLACEHOLDER_PLAYER, doorId: 'ABC', ready: true }}
        />
      </RuleInstruction>

      <Corridor doors={doors} trap={trap} players={players} answerDoorId={answerDoorId} />

      <Space className="i-book-container">
        <Book>
          {Boolean(pages[0]) && (
            <ImageBlurButtonContainer cardId={pages[0]} ghost={false}>
              <ImageCard id={pages[0]} cardWidth={120} />
            </ImageBlurButtonContainer>
          )}
          {Boolean(pages[1]) && (
            <ImageBlurButtonContainer cardId={pages[1]} ghost={false}>
              <ImageCard id={pages[1]} cardWidth={120} />
            </ImageBlurButtonContainer>
          )}
          {Boolean(pages[2]) && (
            <ImageBlurButtonContainer cardId={pages[2]} ghost={false}>
              <ImageCard id={pages[2]} cardWidth={120} />
            </ImageBlurButtonContainer>
          )}
        </Book>
      </Space>
    </Step>
  );
}
