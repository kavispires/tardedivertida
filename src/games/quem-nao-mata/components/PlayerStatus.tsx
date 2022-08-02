import clsx from 'clsx';
import { AvatarCard } from 'components/avatars';
import { IconAvatar } from 'components/icons/IconAvatar';
import { RevolverIcon } from 'components/icons/RevolverIcon';
import { ThinkingIcon } from 'components/icons/ThinkingIcon';
import { getAnimationClass } from 'utils/helpers';

type PlayerStatusProps = {
  player: GamePlayer;
  side: 'left' | 'right';
};

export function PlayerStatus({ player, side }: PlayerStatusProps) {
  // if (player.target) {
  //   console.log(player);
  // }
  if (player.id === '_bobak') {
    console.log('IN', player);
  }
  return (
    <div className={clsx('q-player-status', `q-player-status--${side}`)}>
      <AvatarCard player={player} withName size="small" />
      <div className={clsx('q-player-status__icon', `q-player-status__icon--${side}`)}>
        <IconAvatar
          icon={
            player.target ? (
              <RevolverIcon className={clsx(getAnimationClass('rotateInDownLeft'))} />
            ) : (
              <ThinkingIcon className={clsx(getAnimationClass('flash', undefined, 'slower', true))} />
            )
          }
        />
      </div>
    </div>
  );
}
