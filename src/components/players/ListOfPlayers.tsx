import { Fragment } from 'react';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { AvatarName } from 'components/avatars';
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
};

/**
 * Renders player names from a list of playerIds
 * @param props
 * @returns
 */
export function ListOfPlayers({ players, list, namesOnly, prefix, className }: ListOfPlayersProps) {
  if (namesOnly) {
    return <span className={className}>{list.map((playerId) => players[playerId].name).join(',')}</span>;
  }

  return (
    <span className={className}>
      {list.map((playerId, index) => (
        <Fragment key={`${prefix}-${playerId}`}>
          <AvatarName player={players[playerId]} />
          {index < list.length - 2 && ','}
          {index === list.length - 2 && <Translate pt="e" en="and" />}
        </Fragment>
      ))}
    </span>
  );
}
