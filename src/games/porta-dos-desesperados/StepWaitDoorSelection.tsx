import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { Image, Space } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Utils
import { NOOP, PLACEHOLDER_PLAYER } from '@utils/constants';
// Components
import { ImageBlurButtonContainer } from '@components/image-cards/ImageBlurButtonContainer';
import { ImageCard } from '@components/image-cards/ImageCard';
import { Translate } from '@components/language/Translate';
import { Step } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import { shouldAnnounceTrap } from './utils/helpers';
import { PORTA_DOS_DESESPERADOS_PHASES, ROUND_DURATION, TOTAL_DOORS, TRAPS } from './utils/constants';
import type { TrapEntry } from './utils/types';
import { Book } from './components/Book';
import { Corridor } from './components/Corridor';
import { CrystalHighlight, DoorHighlight, TimeHighlight } from './components/Highlights';
import { BotPopupRule, TrapPopupRule } from './components/RulesBlobs';
import { SandTimer } from './components/SandTimer';

type StepWaitDoorSelectionProps = {
  doors: UID[];
  pages: UID[];
  currentCorridor: number;
  trap: string;
  trapEntry: TrapEntry | null;
  players: GamePlayers;
  answerDoorId: UID;
  magic: number;
  botEnabled?: boolean;
};

export function StepWaitDoorSelection({
  doors,
  pages,
  currentCorridor,
  trap,
  trapEntry,
  players,
  answerDoorId,
  magic,
  botEnabled,
}: StepWaitDoorSelectionProps) {
  const showTrap = useMemo(() => shouldAnnounceTrap(trap, PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE), [trap]);

  const bookCardClass = trap === TRAPS.SEPIA ? 'i-sepia-card' : '';
  const timeLimit = trap === TRAPS.HALF_TIME ? ROUND_DURATION / 2 : ROUND_DURATION;
  const crystalCost = trap === TRAPS.DOUBLE_MAGIC ? 2 : 1;
  const doorsLeft = TOTAL_DOORS - currentCorridor + 1;

  return (
    <Step fullWidth>
      <StepTitle wait>
        <Translate
          pt="Aguarde enquanto os outros jogadores selecionam as portas"
          en="Wait while the players select doors"
        />
      </StepTitle>

      {showTrap && <TrapPopupRule trapEntry={trapEntry} />}

      {botEnabled && <BotPopupRule />}

      <RuleInstruction
        type="rule"
        className="i-sand-timer-container"
      >
        <Translate
          pt="Silêncio e poker face!<br/>Eles tem {timeLimit} minutos para decidir qual(quais) porta(s) entrar.<br/>Cada porta visitada custará {crystalCost} cristal, portanto, escolha sabiamente.<br/>Vocês tem {magic} cristais sobrando e {doorsLeft} portas para achar a saída."
          en="Silence and poker face!<br/>You have {timeLimit} minutes to decide what door(s) to visit.<br/>Each door a player visits costs {crystalCost} crystal, so choose wisely.<br/>You all have {magic} remaining crystals and {doorsLeft} doors to find the exit."
          values={{
            timeLimit: <TimeHighlight>{timeLimit}</TimeHighlight>,
            crystalCost: <CrystalHighlight>{crystalCost}</CrystalHighlight>,
            magic: <CrystalHighlight>{magic}</CrystalHighlight>,
            doorsLeft: <DoorHighlight>{doorsLeft}</DoorHighlight>,
          }}
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

      <Corridor
        doors={doors}
        trap={trap}
        players={players}
        answerDoorId={answerDoorId}
      />

      <Space className="i-book-container">
        <Image.PreviewGroup
          preview={{
            // TODO: AntD bug: it should be classnames.body but it's not working
            rootClassName: clsx(trap === TRAPS.SEPIA && 'image-preview-sepia'),
          }}
        >
          <Book>
            {Boolean(pages[0]) && (
              <ImageBlurButtonContainer
                cardId={pages[0]}
                ghost={false}
              >
                <ImageCard
                  cardId={pages[0]}
                  cardWidth={140}
                  className={bookCardClass}
                  preview={trap !== TRAPS.NO_PREVIEW}
                />
              </ImageBlurButtonContainer>
            )}
            {Boolean(pages[1]) && (
              <ImageBlurButtonContainer
                cardId={pages[1]}
                ghost={false}
              >
                <ImageCard
                  cardId={pages[1]}
                  cardWidth={140}
                  className={bookCardClass}
                  preview={trap !== TRAPS.NO_PREVIEW}
                />
              </ImageBlurButtonContainer>
            )}
            {Boolean(pages[2]) && (
              <ImageBlurButtonContainer
                cardId={pages[2]}
                ghost={false}
              >
                <ImageCard
                  cardId={pages[2]}
                  cardWidth={140}
                  className={bookCardClass}
                  preview={trap !== TRAPS.NO_PREVIEW}
                />
              </ImageBlurButtonContainer>
            )}
          </Book>
        </Image.PreviewGroup>
      </Space>
    </Step>
  );
}
