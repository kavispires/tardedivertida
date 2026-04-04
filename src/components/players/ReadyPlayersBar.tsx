// Ant Design Resources
import { LikeFilled } from '@ant-design/icons';
import { Avatar, Typography } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Components
import { Translate } from 'components/language/Translate';
import { PlayerAvatar } from 'components/player/PlayerAvatar';
// Sass
import styles from './ReadyPlayersBar.module.scss';

type ReadyPlayersBarProps = {
  /**
   * The game players object
   */
  players: GamePlayers;
  /**
   * Text to display for ready status (singular)
   */
  readyText?: string;
  /**
   * Text to display for ready status (plural)
   */
  readyTextPlural?: string;
  /**
   * Whether to hide player names
   */
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
      (acc: { readyPlayers: GamePlayer[]; notReadyPlayers: string[] }, player: GamePlayer) => {
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
      },
    );

  if (readyPlayers.length === 0) {
    return <span></span>;
  }

  return (
    <div className={styles.readyPlayerBar}>
      <div className={styles.readyPlayerBarBar}>
        <Avatar.Group size="small">
          {readyPlayers.map((player) => (
            <PlayerAvatar
              key={player.name}
              avatarId={player.avatarId}
            />
          ))}
        </Avatar.Group>
        <span className={styles.readyPlayerBarSpeechBubble}>
          <Typography.Text>
            {readyPlayers.length > 1 ? (
              <Translate
                pt="Estamos prontos!"
                en="We're ready!"
                custom={readyTextPlural}
              />
            ) : (
              <Translate
                pt="Estou pronto!"
                en="I'm ready!"
                custom={readyText}
              />
            )}
          </Typography.Text>
          <LikeFilled className={styles.readyPlayerBarSpeechBubbleIcon} />
        </span>
      </div>
      {!hideNames && notReadyPlayers.length > 0 && (
        <span className={styles.readyPlayerBarNames}>
          <Translate
            pt="Esperando"
            en="Waiting for"
          />
          : {notReadyPlayers.join(', ')}
        </span>
      )}
    </div>
  );
}
