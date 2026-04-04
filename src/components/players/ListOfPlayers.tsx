import { Fragment } from 'react';
// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Components
import { Translate } from 'components/language/Translate';
import { PlayerAvatar } from 'components/player/PlayerAvatar';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';

type ListOfPlayersProps = {
  /**
   * The players
   */
  players: GamePlayers;
  /**
   * The ordered subset of players to be listed
   */
  list: UID[];
  /**
   * The key prefix
   */
  prefix: string;
  /**
   * Flag indicating if only the names should be listed
   */
  namesOnly?: boolean;
  /**
   * Optional class name
   */
  className?: string;
  /**
   * Flag indicating if only the avatars should be listed
   */
  avatarsOnly?: boolean;
} & React.HTMLAttributes<HTMLSpanElement>;

/**
 * Renders player names from a list of playerIds
 * @param props
 * @returns
 */
export function ListOfPlayers({
  players,
  list,
  namesOnly,
  prefix,
  className,
  avatarsOnly,
  ...rest
}: ListOfPlayersProps) {
  if (namesOnly) {
    return <span className={className}>{list.map((playerId) => players[playerId].name).join(',')}</span>;
  }

  if (avatarsOnly) {
    return (
      <span
        className={className}
        {...rest}
      >
        {list.map((playerId) => (
          <Tooltip
            key={playerId}
            title={players[playerId].name}
          >
            <PlayerAvatar avatarId={players[playerId].avatarId} />
          </Tooltip>
        ))}
      </span>
    );
  }

  return (
    <span
      className={className}
      {...rest}
    >
      {list.map((playerId, index) => (
        <Fragment key={`${prefix}-${playerId}`}>
          <PlayerAvatarName player={players[playerId]} />
          {index < list.length - 2 && ','}
          {index === list.length - 2 && (
            <Translate
              pt="e"
              en="and"
            />
          )}
        </Fragment>
      ))}
    </span>
  );
}
