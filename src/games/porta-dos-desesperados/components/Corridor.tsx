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
import { ImageBlurButton, ImageCard, ImageCardBack } from 'components/cards';
import { Translate } from 'components/language';
import { DoorFrame } from './DoorFrame';
import { Avatar } from 'components/avatars';

type CorridorProps = {
  doors: CardId[];
  trap: string;
  onSubmitDoor?: GenericFunction;
  answerDoorId?: CardId;
  players: GamePlayers;
  user?: GamePlayer;
  hideVotes?: boolean;
  disabled?: boolean;
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
}: CorridorProps) {
  const doorWidth = useCardWidth(8, 8, 150, 350, 8);
  const { isLoading } = useLoading();

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

  return (
    <Image.PreviewGroup>
      <div className="i-corridor">
        {doors.map((doorId, index) => {
          const animationDelayIndex = index < 3 ? index : doors.length - 1 - index;
          const isConcealed = trap === TRAPS.CONCEALED_DOOR && index === 2;
          return (
            <div
              key={doorId}
              className={clsx(
                'i-door',
                answerDoorId === doorId && 'i-door--answer',
                getAnimationClass('zoomIn', { delay: animationDelayIndex })
              )}
            >
              <DoorFrame width={doorWidth} index={index}>
                {isConcealed ? (
                  <ImageCardBack cardWidth={150} imageId="back-lockedDoor" />
                ) : (
                  <ImageCard imageId={doorId} cardWidth={150} preview={trap !== TRAPS.NO_PREVIEW} />
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
