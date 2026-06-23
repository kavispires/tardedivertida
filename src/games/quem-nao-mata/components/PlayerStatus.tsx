import clsx from 'clsx';
// Types
import type { GamePlayer } from 'types/game';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Icons
import { RevolverIcon } from '@icons/RevolverIcon';
import { ThinkingIcon } from '@icons/ThinkingIcon';
// Components
import { Icon } from '@components/general/Icon';
import { PlayerAvatarCard } from '@components/player/PlayerAvatarCard';

type PlayerStatusProps = {
  player: GamePlayer;
  side: 'left' | 'right';
};

export function PlayerStatus({ player, side }: PlayerStatusProps) {
  return (
    <div className={clsx('q-player-status', `q-player-status--${side}`)}>
      <PlayerAvatarCard
        player={player}
        withName
        size="small"
      />
      <div className={clsx('q-player-status__icon', `q-player-status__icon--${side}`)}>
        <Icon
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
