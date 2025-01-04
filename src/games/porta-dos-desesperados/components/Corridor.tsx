import clsx from 'clsx';
import { random, sample } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { RadarChartOutlined } from '@ant-design/icons';
import { Avatar as AntAvatar, Image } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCache } from 'hooks/useCache';
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { SendButton } from 'components/buttons';
import { DoorFrame } from 'components/game/DoorFrame';
import { ImageBlurButton, ImageCard, ImageCardBack } from 'components/image-cards';
import { Translate } from 'components/language';
// Internal
import { TRAPS } from '../utils/constants';
import type { SubmitDoorPayload } from '../utils/types';

type CorridorProps = {
  doors: CardId[];
  trap: string;
  onSubmitDoor?: (payload: SubmitDoorPayload) => void;
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

  const { cache } = useCache();

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
    [players],
  );

  // Trap: Blind Door
  const blindDoor = useMemo(
    () => (trap === TRAPS.BLIND_DOOR && !disableTrap ? random(0, doors.length - 1) : undefined),
    [trap, doors.length, disableTrap],
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
                getAnimationClass('zoomIn', { delay: animationDelayIndex }),
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
                    }),
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

                {!!onSubmitDoor && (
                  <SendButton
                    onClick={() => onSubmitDoor({ doorId })}
                    size="small"
                    type="default"
                    disabled={disabled || user?.ready || user?.doorId === doorId}
                    shape="round"
                    ghost
                    icon={''}
                  >
                    <Translate pt="Selecionar" en="Select" />
                  </SendButton>
                )}

                <AntAvatar.Group maxCount={7} size="small" className="i-door__votes">
                  {voteMap[doorId] && !hideVotes ? (
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
