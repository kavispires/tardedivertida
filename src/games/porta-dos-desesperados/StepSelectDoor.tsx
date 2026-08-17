import clsx from 'clsx';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { RadarChartOutlined } from '@ant-design/icons';
import { Image, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Utils
import { getAnimationClass, removeDuplicates } from '@utils/helpers';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { ImageBlurButtonContainer } from '@components/image-cards/ImageBlurButtonContainer';
import { ImageCard } from '@components/image-cards/ImageCard';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { Surface } from '@components/layout/Surface';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import { PORTA_DOS_DESESPERADOS_PHASES, ROUND_DURATION, TOTAL_DOORS, TRAPS } from './utils/constants';
import { shouldAnnounceTrap } from './utils/helpers';
import { mockDoorSelection } from './utils/mock';
import type { SubmitDoorPayload, TrapEntry } from './utils/types';
import { Book } from './components/Book';
import { Corridor } from './components/Corridor';
import { CrystalHighlight, DoorHighlight, TimeHighlight } from './components/Highlights';
import { BotPopupRule, TrapPopupRule } from './components/RulesBlobs';
import { SandTimer } from './components/SandTimer';

type StepSelectPagesProps = {
  doors: UID[];
  pages: UID[];
  currentCorridor: number;
  trap: string;
  trapEntry: TrapEntry | null;
  onSubmitDoor: (payload: SubmitDoorPayload) => void;
  onConfirmDoor: () => void;
  players: GamePlayers;
  user: GamePlayer;
  possessed: GamePlayer;
  magic: number;
  botEnabled?: boolean;
  answerDoorId: UID;
};

export function StepSelectDoor({
  doors,
  pages,
  currentCorridor,
  trap,
  trapEntry,
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

  const showTrap = useMemo(() => shouldAnnounceTrap(trap, PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE), [trap]);

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

  const selectedDoors = useMemo(
    () =>
      removeDuplicates(
        Object.values(players)
          .map((player) => player.doorId)
          .filter(Boolean),
      ).length,
    [players],
  );

  /**
   * When there are less crystals than doors, disabled additional voting doors
   */
  const shouldRestrainDoorConfirmation = !!magic && magic < doors.length && selectedDoors > magic;
  const timeLimit = trap === TRAPS.HALF_TIME ? ROUND_DURATION / 2 : ROUND_DURATION;
  const crystalCost = trap === TRAPS.DOUBLE_MAGIC ? 2 : 1;
  const doorsLeft = TOTAL_DOORS - currentCorridor + 1;

  return (
    <Step fullWidth>
      <StepTitle>
        <Translate
          pt="Selecione a porta correta"
          en="Select the correct door"
        />
      </StepTitle>

      {showTrap && <TrapPopupRule trapEntry={trapEntry} />}

      {botEnabled && <BotPopupRule />}

      <RuleInstruction
        type="rule"
        className="i-sand-timer-container"
      >
        <Translate
          pt="O livro contém dicas dadas por {possessed} que ainda está possuído pelo livro e não pode falar.<br/>Vocês tem {timeLimit} minutos para decidir qual(quais) porta(s) entrar.<br/>Cada porta visitada custará {crystalCost} cristal, portanto, escolha sabiamente.<br/>Vocês tem {magic} cristais sobrando e {doorsLeft} portas para achar a saída."
          en="The book contains hints given by {possessed} who is still possessed by the book and can't speak.<br/>You have {timeLimit} minutes to decide what door(s) to visit.<br/>Each door a player visits costs {crystalCost} crystal, so choose wisely.<br/>You all have {magic} remaining crystals and {doorsLeft} doors to find the exit."
          values={{
            possessed: <PlayerAvatarName player={possessed} />,
            timeLimit: <TimeHighlight>{timeLimit}</TimeHighlight>,
            crystalCost: <CrystalHighlight>{crystalCost}</CrystalHighlight>,
            magic: <CrystalHighlight>{magic}</CrystalHighlight>,
            doorsLeft: <DoorHighlight>{doorsLeft}</DoorHighlight>,
          }}
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

      {trap === TRAPS.SECRET_CHOICE && (
        <Surface
          contained
          className={getAnimationClass('pulse', {
            speed: 'slower',
            infinite: true,
          })}
        >
          <strong>
            <RadarChartOutlined />{' '}
            <Translate
              pt="Silêncio Absoluto!"
              en="Absolute Silence!"
            />
          </strong>
        </Surface>
      )}

      <RuleInstruction type="action">
        <Translate
          pt={`<strong>Selecione</strong> uma das portas que você acha que mais se relaciona com o livro.<br/>${trap === TRAPS.LOCKED_CHOICE ? 'Você não pode trocar de porta depois de escolher!' : 'Você pode trocar de porta quantas vezes quiser até confirmar sua escolha ou o tempo acabar.'}`}
          en={`<strong>Select</strong> one of the doors you think is most related to the book.<br/>${trap === TRAPS.LOCKED_CHOICE ? 'You cannot change your door after you choose!' : 'You can change your door as many times as you want until you confirm your choice or time runs out.'}`}
        />
      </RuleInstruction>

      <Corridor
        doors={trap === TRAPS.SHUFFLED_DOORS ? user.shuffledDoorOrder : doors}
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
            // TODO: AntD bug: it should be classnames.body but it's not working
            rootClassName: clsx({ 'image-preview-sepia': trap === TRAPS.SEPIA }),
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
      {Boolean(user.doorId) && (
        <SpaceFloat>
          <SendButton
            size="large"
            disabled={!user.doorId || user.ready || isButtonDisabled || shouldRestrainDoorConfirmation}
            onClick={() => onConfirmDoor()}
          >
            <Translate
              pt="Confirmar Porta"
              en="Confirm Door"
            />
          </SendButton>
        </SpaceFloat>
      )}
    </Step>
  );
}
