import { useMemo, useState } from 'react';
// Ant Design Resources
import { Button, Image, Space } from 'antd';
import { RadarChartOutlined } from '@ant-design/icons';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useSepiaPreview } from './utils/useSepiaPreview';
// Utils
import { PHASES } from 'utils/phases';
import { ROUND_DURATION, TOTAL_DOORS, TRAPS } from './utils/constants';
import { shouldAnnounceTrap } from './utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { getAnimationClass } from 'utils/helpers';
import { Book } from './components/Book';
import { Corridor } from './components/Corridor';
import { CrystalHighlight, DoorHighlight, TimeHighlight } from './components/Highlights';
import { BotPopupRule, TrapPopupRule } from './components/RulesBlobs';
import { SandTimer } from './components/SandTimer';
import { useMock } from 'hooks/useMock';
import { mockDoorSelection } from './utils/mock';

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

  useSepiaPreview(trap === TRAPS.SEPIA);

  const bookCardClass = trap === TRAPS.SEPIA ? 'i-sepia-card' : '';

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

  return (
    <Step fullWidth>
      <Title size="medium" white>
        <Translate pt="Selecione a porta correta" en="Select the correct door" />
      </Title>

      {showTrap && <TrapPopupRule trap={trap} />}

      {botEnabled && <BotPopupRule />}

      {Boolean(user.doorId) && (
        <Button
          type="primary"
          size="large"
          loading={isLoading}
          disabled={!user.doorId || user.ready || isButtonDisabled}
          onClick={() => onConfirmDoor()}
        >
          <Translate pt="Confirmar Porta" en="Confirm Door" />
        </Button>
      )}

      <Instruction contained className="i-sand-timer-container">
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
      </Instruction>

      {trap === TRAPS.NO_COMMUNICATION && (
        <Instruction contained className={getAnimationClass('pulse', { speed: 'slower', infinite: true })}>
          <strong>
            <RadarChartOutlined /> <Translate pt="Silêncio Absoluto!" en="Absolute Silence!" />
          </strong>
        </Instruction>
      )}

      <Corridor
        doors={doors}
        trap={trap}
        onSubmitDoor={onSubmitDoor}
        players={players}
        user={user}
        hideVotes={trap === TRAPS.SECRET_CHOICE}
        disabled={isButtonDisabled}
      />

      <Space className="i-book-container">
        <Image.PreviewGroup>
          <Book>
            {Boolean(pages[0]) && (
              <ImageBlurButtonContainer cardId={pages[0]} ghost={false}>
                <ImageCard
                  imageId={pages[0]}
                  cardWidth={140}
                  className={bookCardClass}
                  preview={trap !== TRAPS.NO_PREVIEW}
                />
              </ImageBlurButtonContainer>
            )}
            {Boolean(pages[1]) && (
              <ImageBlurButtonContainer cardId={pages[1]} ghost={false}>
                <ImageCard
                  imageId={pages[1]}
                  cardWidth={140}
                  className={bookCardClass}
                  preview={trap !== TRAPS.NO_PREVIEW}
                />
              </ImageBlurButtonContainer>
            )}
            {Boolean(pages[2]) && (
              <ImageBlurButtonContainer cardId={pages[2]} ghost={false}>
                <ImageCard
                  imageId={pages[2]}
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
