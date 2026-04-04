// Types
import type { GamePlayer } from 'types/game';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Icons
import { KnifeIcon } from 'icons/KnifeIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { TransparentButton } from 'components/buttons/TransparentButton';
import { Translate } from 'components/language/Translate';
import { PlayerAvatarCard } from 'components/player/PlayerAvatarCard';

type PlayerTargetCardButtonProps = {
  player: GamePlayer;
  width: number;
  target?: UID;
  onClick: GenericFunction;
  disabled?: boolean;
  isAmbush?: boolean;
};

export function PlayerTargetCardButton({
  player,
  width,
  target,
  onClick,
  disabled = false,
  isAmbush = false,
}: PlayerTargetCardButtonProps) {
  return (
    <TransparentButton
      className={'q-player-target-card-button'}
      style={{ backgroundColor: getAvatarColorById(player.avatarId), width: `${width}%` }}
      active={target === player.id}
      onClick={() => onClick(player.id)}
      disabled={disabled}
    >
      {isAmbush ? (
        <div className="q-ambush-card">
          <PlayerAvatarCard
            player={player}
            replacementAvatar={<IconAvatar icon={<KnifeIcon />} />}
            size="small"
          />
          <div className="a">
            <Translate
              pt="Emboscar!"
              en="Ambush!"
            />
          </div>
        </div>
      ) : (
        <PlayerAvatarCard
          player={player}
          withName
          addressUser
          size="small"
        />
      )}
    </TransparentButton>
  );
}
