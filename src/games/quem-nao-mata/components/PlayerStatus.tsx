import clsx from 'clsx';
// Types
import type { GamePlayer } from 'types/player';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { RevolverIcon } from 'icons/RevolverIcon';
import { ThinkingIcon } from 'icons/ThinkingIcon';
// Components
import { AvatarCard, IconAvatar } from 'components/avatars';

type PlayerStatusProps = {
  player: GamePlayer;
  side: 'left' | 'right';
};

export function PlayerStatus({ player, side }: PlayerStatusProps) {
  return (
    <div className={clsx('q-player-status', `q-player-status--${side}`)}>
      <AvatarCard player={player} withName size="small" />
      <div className={clsx('q-player-status__icon', `q-player-status__icon--${side}`)}>
        <IconAvatar
          icon={
            player.target ? (
              <RevolverIcon className={clsx(getAnimationClass('rotateInDownLeft'))} />
            ) : (
              <ThinkingIcon
                className={clsx(getAnimationClass('flash', { speed: 'slower', infinite: true }))}
              />
            )
          }
        />
      </div>
    </div>
  );
}
