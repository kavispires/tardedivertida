import { AvatarCard } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { IconAvatar } from 'components/icons/IconAvatar';
import { KnifeIcon } from 'components/icons/KnifeIcon';
import { Translate } from 'components/language';
import { getAvatarColorById } from 'utils/helpers';

type PlayerTargetCardButtonProps = {
  player: GamePlayer;
  width: number;
  target?: PlayerId;
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
          <AvatarCard player={player} replacementAvatar={<IconAvatar icon={<KnifeIcon />} />} size="small" />
          <div className="a">
            <Translate pt="Emboscar!" en="Ambush!" />
          </div>
        </div>
      ) : (
        <AvatarCard player={player} withName addressUser size="small" />
      )}
    </TransparentButton>
  );
}
