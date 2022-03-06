// Ant Design Resources
import { Badge } from 'antd';
// Utils
import { AVATARS } from 'utils/constants';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { Avatar, Translate } from 'components';

type SectionMeProps = {
  player: Player;
  isTeamGame?: boolean;
};

export function SectionMe({ player, isTeamGame = false }: SectionMeProps) {
  const { language } = useLanguage();

  return (
    <div className="game-info-drawer__section-me">
      <div className="game-info-drawer__label">
        <Translate pt="Você é" en="You are" />
        {isTeamGame && (
          <Translate pt={` do time ${player?.team ?? '?'}`} en={` on team ${player?.team ?? '?'}`} />
        )}
      </div>
      <div className="game-info-drawer__me">
        <Badge count={player.score} className="game-info-drawer__avatar-with-badge">
          <Avatar id={player.avatarId} shape="square" />
        </Badge>
        {player.name}, {AVATARS[player.avatarId].description[language]}
      </div>
    </div>
  );
}
