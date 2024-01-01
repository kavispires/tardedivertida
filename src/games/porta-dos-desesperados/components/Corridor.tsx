import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { Avatar as AntAvatar, Button, Image } from 'antd';
import { RadarChartOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
// Utils
import { getAnimationClass } from 'utils/helpers';
import { TRAPS } from '../utils/constants';
// Components
import { ImageBlurButton, ImageCard, ImageCardBack } from 'components/image-cards';
import { Translate } from 'components/language';
import { DoorFrame } from '../../../components/game/DoorFrame';
import { Avatar } from 'components/avatars';
import { random, sample } from 'lodash';
import { useGlobalState } from 'hooks/useGlobalState';

type CorridorProps = {
  doors: CardId[];
  trap: string;
  onSubmitDoor?: GenericFunction;
  answerDoorId?: CardId;
  players: GamePlayers;
  user?: GamePlayer;
  hideVotes?: boolean;
  disabled?: boolean;
  disableTrap?: boolean;
};

export function Corridor({
  doors,
  onSubmitDoor,
  trap,
  players,
  answerDoorId,
  user,
  hideVotes = false,
  disabled = false,
  disableTrap = false,
}: CorridorProps) {
  const doorWidth = useCardWidth(8, {
    gap: 8,
    minWidth: 150,
    maxWidth: 350,
    margin: 8,
  });
  const { isLoading } = useLoading();
  const [cache] = useGlobalState('cache');

  const voteMap = useMemo(
    () =>
      Object.values(players).reduce((acc: Record<CardId, PlayerId[]>, player) => {
        if (player.doorId) {
          if (acc[player.doorId] === undefined) {
            acc[player.doorId] = [];
          }
          acc[player.doorId].push(player.id);
        }
        return acc;
      }, {}),
    [players]
  );

  // Trap: Blind Door
  const blindDoor = useMemo(
    () => (trap === TRAPS.BLIND_DOOR && !disableTrap ? random(0, doors.length - 1) : undefined),
    [trap, doors.length, disableTrap]
  );

  // Trap: Vanishing doors OR Delaying Doors
  const hiddenDoorsIndexes = useMemo(() => {
    if ([TRAPS.VANISHING_DOORS, TRAPS.DELAYING_DOORS].includes(trap) && !disableTrap) {
      return cache?.doors || [];
    }
  }, [cache, trap, disableTrap]);

  return (
    <Image.PreviewGroup
      preview={{
        className: clsx(trap === TRAPS.FADED_DOORS && 'image-preview-fading'),
      }}
    >
      <div className="i-corridor">
        {doors.map((doorId, index) => {
          const animationDelayIndex = index < 3 ? index : doors.length - 1 - index;
          const isConcealed = trap === TRAPS.CONCEALED_DOOR && index === 2;
          const isVanished = trap === TRAPS.VANISHING_DOORS && hiddenDoorsIndexes?.includes(index);
          const isDelayed =
            trap === TRAPS.DELAYING_DOORS && !disableTrap && !hiddenDoorsIndexes?.includes(index);
          return (
            <div
              key={doorId}
              className={clsx(
                'i-door',
                answerDoorId === doorId && 'i-door--answer',
                getAnimationClass('zoomIn', { delay: animationDelayIndex })
              )}
            >
              <DoorFrame
                width={doorWidth}
                index={index}
                className={clsx(
                  trap === TRAPS.VANISHING_DOORS
                    ? isVanished
                      ? getAnimationClass('fadeOut', { speed: 'slower' })
                      : ''
                    : '',
                  trap === TRAPS.DELAYING_DOORS
                    ? isDelayed
                      ? 'invisible'
                      : getAnimationClass('fadeIn', { speed: 'slower' })
                    : '',
                  trap === TRAPS.DANCING_DOORS &&
                    !disableTrap &&
                    getAnimationClass(sample(['swing', 'wobble', 'rubberBand']), {
                      infinite: true,
                      delay: random(0, 10) / 2,
                    })
                )}
              >
                {isConcealed || blindDoor === index ? (
                  <ImageCardBack cardWidth={150} id="back-lockedDoor" />
                ) : (
                  <ImageCard
                    id={doorId}
                    cardWidth={150}
                    className={clsx(trap === TRAPS.FADED_DOORS && 'i-faded-card')}
                    preview={trap !== TRAPS.NO_PREVIEW ? true : undefined}
                    previewImageId={isDelayed || isVanished ? 'back-lockedDoor' : undefined}
                  />
                )}
              </DoorFrame>

              <div className="i-door__options">
                <ImageBlurButton cardId={doorId} />

                {Boolean(onSubmitDoor) && (
                  <Button
                    onClick={() => onSubmitDoor!({ doorId })}
                    size="small"
                    disabled={disabled || isLoading || user?.ready || user?.doorId === doorId}
                    shape="round"
                    ghost
                  >
                    <Translate pt="Selecionar" en="Select" />
                  </Button>
                )}

                <AntAvatar.Group maxCount={7} size="small" className="i-door__votes">
                  {Boolean(voteMap[doorId] && !hideVotes) ? (
                    <>
                      {voteMap[doorId].map((playerId) => (
                        <Avatar
                          key={`vote-${playerId}`}
                          id={players[playerId].avatarId}
                          alt={players[playerId].name}
                          className={getAnimationClass('slideInUp')}
                        />
                      ))}
                    </>
                  ) : (
                    <AntAvatar
                      size="small"
                      className={clsx(!hideVotes && 'invisible')}
                      icon={<RadarChartOutlined />}
                      style={{ backgroundColor: '#000' }}
                    />
                  )}
                </AntAvatar.Group>
              </div>
            </div>
          );
        })}
      </div>
    </Image.PreviewGroup>
  );
}
