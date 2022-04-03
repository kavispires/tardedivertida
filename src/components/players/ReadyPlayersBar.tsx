// Ant Design Resources
import { Avatar as AntAvatar, Typography } from 'antd';
import { LikeFilled } from '@ant-design/icons';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';

type ReadyPlayersBarProps = {
  players: GamePlayers;
  readyText?: string;
  readyTextPlural?: string;
  hideNames?: boolean;
};

export function ReadyPlayersBar({
  players,
  readyText,
  readyTextPlural,
  hideNames = false,
}: ReadyPlayersBarProps) {
  const { readyPlayers, notReadyPlayers }: { readyPlayers: GamePlayer[]; notReadyPlayers: string[] } =
    Object.values(players).reduce(
      (acc: any, player: GamePlayer) => {
        if (player.ready) {
          acc.readyPlayers.push(player);
        } else {
          acc.notReadyPlayers.push(player.name);
        }
        return acc;
      },
      {
        readyPlayers: [],
        notReadyPlayers: [],
      }
    );

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
      {!hideNames && notReadyPlayers.length > 0 && (
        <span className="ready-player-bar__names">
          <Translate pt="Esperando" en="Waiting for" />: {notReadyPlayers.join(', ')}
        </span>
      )}
    </div>
  );
}
