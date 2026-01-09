import { Fragment } from 'react';
// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { PlayerAvatar, PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';

type ListOfPlayersProps = {
  /**
   * The players
   */
  players: GamePlayers;
  /**
   * The ordered subset of players to be listed
   */
  list: PlayerId[];
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
};

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
}: ListOfPlayersProps) {
  if (namesOnly) {
    return <span className={className}>{list.map((playerId) => players[playerId].name).join(',')}</span>;
  }

  if (avatarsOnly) {
    return (
      <span className={className}>
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
    <span className={className}>
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
