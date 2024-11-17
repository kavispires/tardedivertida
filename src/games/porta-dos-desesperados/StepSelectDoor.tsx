import clsx from 'clsx';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { RadarChartOutlined } from '@ant-design/icons';
import { Button, Image, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { getAnimationClass, removeDuplicates } from 'utils/helpers';
import { PHASES } from 'utils/phases';
// Components
import { AvatarName } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, RuleInstruction, Title } from 'components/text';
// Internal
import { useDancingDoors } from './utils/useTrapHooks';
import { ROUND_DURATION, TOTAL_DOORS, TRAPS } from './utils/constants';
import { shouldAnnounceTrap } from './utils/helpers';
import { mockDoorSelection } from './utils/mock';
import { Book } from './components/Book';
import { Corridor } from './components/Corridor';
import { CrystalHighlight, DoorHighlight, TimeHighlight } from './components/Highlights';
import { BotPopupRule, TrapPopupRule } from './components/RulesBlobs';
import { SandTimer } from './components/SandTimer';

type StepSelectPagesProps = {
  doors: CardId[];
  pages: CardId[];
  currentCorridor: number;
  trap: string;
  onSubmitDoor: GenericFunction;
  onConfirmDoor: GenericFunction;
  players: GamePlayers;
  user: GamePlayer;
  possessed: GamePlayer;
  magic: number;
  botEnabled?: boolean;
  answerDoorId: ImageCardId;
};

export function StepSelectDoor({
  doors,
  pages,
  currentCorridor,
  trap,
  onSubmitDoor,
  onConfirmDoor,
  players,
  user,
  possessed,
  magic,
  botEnabled,
  answerDoorId,
}: StepSelectPagesProps) {
  const { isLoading } = useLoading();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const showTrap = useMemo(() => shouldAnnounceTrap(trap, PHASES.PORTA_DOS_DESESPERADOS.DOOR_CHOICE), [trap]);

  const bookCardClass = trap === TRAPS.SEPIA ? 'i-sepia-card' : '';

  useDancingDoors(trap === TRAPS.DANCING_DOORS);

  // DEV Only
  useMock(() => {
    // Submit door
    if (!user.doorId) {
      onSubmitDoor({ doorId: mockDoorSelection(doors, answerDoorId) });
    }
  }, [user.ready, possessed.id, isLoading, user.doorId]);

  useMock(() => {
    onConfirmDoor();
  }, [user.doorId]);

  const selectedDoors = useMemo(
    () =>
      removeDuplicates(
        Object.values(players)
          .map((player) => player.doorId)
          .filter(Boolean)
      ).length,
    [players]
  );

  /**
   * When there are less crystals than doors, disabled additional voting doors
   */
  const shouldRestrainDoorConfirmation = !!magic && magic < doors.length && selectedDoors > magic;

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Selecione a porta correta" en="Select the correct door" />
      </Title>

      {showTrap && <TrapPopupRule trap={trap} />}

      {botEnabled && <BotPopupRule />}

      <RuleInstruction type="rule" className="i-sand-timer-container">
        <Translate
          pt={
            <>
              O livro contém dicas dadas por <AvatarName player={possessed} /> que ainda está possuído pelo
              livro e não pode falar.
              <br />
              Vocês tem{' '}
              <TimeHighlight>
                {trap === TRAPS.HALF_TIME ? ROUND_DURATION / 2 : ROUND_DURATION}
              </TimeHighlight>{' '}
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
              The book contains hints given by <AvatarName player={possessed} /> who is still possessed by the
              book and can't speak.
              <br />
              You have{' '}
              <TimeHighlight>
                {trap === TRAPS.HALF_TIME ? ROUND_DURATION / 2 : ROUND_DURATION}
              </TimeHighlight>{' '}
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
          onDisableButtons={() => setIsButtonDisabled(true)}
          onSubmitDoor={onSubmitDoor}
          onMakeReady={onConfirmDoor}
          user={user}
        />
      </RuleInstruction>

      {trap === TRAPS.NO_COMMUNICATION && (
        <Instruction contained className={getAnimationClass('pulse', { speed: 'slower', infinite: true })}>
          <strong>
            <RadarChartOutlined /> <Translate pt="Silêncio Absoluto!" en="Absolute Silence!" />
          </strong>
        </Instruction>
      )}

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              <strong>Selecione</strong> uma das portas que você acha que mais se relaciona com o livro.
              <br />
              {trap === TRAPS.LOCKED_CHOICE
                ? 'Você não pode trocar de porta depois de escolher!'
                : 'Você pode trocar de porta quantas vezes quiser até confirmar sua escolha ou o tempo acabar.'}
            </>
          }
          en={
            <>
              <strong>Select</strong> one of the doors you think is most related to the book.
              <br />
              {trap === TRAPS.LOCKED_CHOICE
                ? 'You cannot change your door after you choose!'
                : 'You can change your door as many times as you want until you confirm your choice or time runs out.'}
            </>
          }
        />
      </RuleInstruction>

      {Boolean(user.doorId) && (
        <Button
          type="primary"
          size="large"
          loading={isLoading}
          disabled={!user.doorId || user.ready || isButtonDisabled || shouldRestrainDoorConfirmation}
          onClick={() => onConfirmDoor()}
        >
          <Translate pt="Confirmar Porta" en="Confirm Door" />
        </Button>
      )}

      <Corridor
        doors={doors}
        trap={trap}
        onSubmitDoor={onSubmitDoor}
        players={players}
        user={user}
        hideVotes={trap === TRAPS.SECRET_CHOICE}
        disabled={isButtonDisabled || (trap === TRAPS.LOCKED_CHOICE && user.doorId)}
      />

      <Space className="i-book-container">
        <Image.PreviewGroup
          preview={{
            className: clsx(trap === TRAPS.SEPIA && 'image-preview-sepia'),
          }}
        >
          <Book>
            {Boolean(pages[0]) && (
              <ImageBlurButtonContainer cardId={pages[0]} ghost={false}>
                <ImageCard
                  id={pages[0]}
                  cardWidth={140}
                  className={bookCardClass}
                  preview={trap !== TRAPS.NO_PREVIEW}
                />
              </ImageBlurButtonContainer>
            )}
            {Boolean(pages[1]) && (
              <ImageBlurButtonContainer cardId={pages[1]} ghost={false}>
                <ImageCard
                  id={pages[1]}
                  cardWidth={140}
                  className={bookCardClass}
                  preview={trap !== TRAPS.NO_PREVIEW}
                />
              </ImageBlurButtonContainer>
            )}
            {Boolean(pages[2]) && (
              <ImageBlurButtonContainer cardId={pages[2]} ghost={false}>
                <ImageCard
                  id={pages[2]}
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
