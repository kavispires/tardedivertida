// Design Resources
import { Avatar as AntAvatar, Typography } from 'antd';
import { LikeFilled } from '@ant-design/icons';
// Components
import { Avatar, Translate } from '..';

type ReadyPlayersBarProps = {
  players: GamePlayers;
  readyText?: string;
  readyTextPlural?: string;
  showNames?: boolean;
};

export function ReadyPlayersBar({
  players,
  readyText,
  readyTextPlural,
  showNames = false,
}: ReadyPlayersBarProps) {
  const readyPlayers = Object.values(players).filter((player) => player.ready);
  if (readyPlayers.length === 0) {
    return <span></span>;
  }

  return (
    <div className="ready-player-bar">
      <div className="ready-player-bar__bar">
        <AntAvatar.Group size="small">
          {readyPlayers.map((player) => (
            <Avatar key={player.name} id={player.avatarId} />
          ))}
        </AntAvatar.Group>
        <span className="ready-player-bar__speech-bubble">
          <Typography.Text>
            {readyPlayers.length > 1 ? (
              <Translate pt="Estamos prontos!" en="We're ready!" custom={readyTextPlural} />
            ) : (
              <Translate pt="Estou pronto!" en="I'm ready!" custom={readyText} />
            )}
          </Typography.Text>
          <LikeFilled className="ready-player-bar__speech-bubble-icon" />
        </span>
      </div>
      {showNames && (
        <span className="ready-player-bar__names">
          ({readyPlayers.map((player) => player.name).join(', ')})
        </span>
      )}
    </div>
  );
}
