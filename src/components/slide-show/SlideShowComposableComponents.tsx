import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { CrownFilled, MessageFilled } from '@ant-design/icons';
import { Avatar as AntAvatar } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { getPlayerNamesFromIds } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';

/**
 * A functional component that renders a label for the slide show.
 */
export function SlideShowLabel({ children, className, ...props }: ElementPropsWithChildren) {
  return (
    <div className={clsx('slide-show-composable__label', className)} {...props}>
      {children}
    </div>
  );
}

type SlideShowBubbleProps = {
  /**
   * If true, the bubble will display a crown icon.
   */
  winner?: boolean;
  /**
   * The background color of the bubble.
   */
  backgroundColor?: string;
} & ElementPropsWithChildren;

/**
 * A component that displays a bubble value in a slide show.
 * It conditionally renders a crown icon if the `winner` prop is true,
 * otherwise, it renders a message icon.
 */
export function SlideShowBubbleValue({
  children,
  winner,
  backgroundColor,
  className,
  ...props
}: SlideShowBubbleProps) {
  return (
    <div
      className={clsx('slide-show-composable__bubble-value', className)}
      style={winner && backgroundColor ? { backgroundColor, color: 'white' } : {}}
      {...props}
    >
      {winner ? (
        <CrownFilled
          className="slide-show-composable__bubble-icon"
          style={backgroundColor ? { color: 'white' } : {}}
        />
      ) : (
        <MessageFilled className="slide-show-composable__bubble-icon" />
      )}

      {children}
    </div>
  );
}

type SlideShowPlayersListProps = {
  /**
   * The player objects.
   */
  players: GamePlayers;
  /**
   * The player IDs to be displayed.
   */
  playersIds: PlayerId[];
} & ElementProps;

/**
 * SlideShowPlayersList component displays a list of player avatars and their names.
 */
export function SlideShowPlayersList({
  players,
  playersIds,
  className,
  children,
  ...props
}: SlideShowPlayersListProps) {
  const selectedPlayersNames = useMemo(
    () => getPlayerNamesFromIds(playersIds, players).join(', '),
    [playersIds, players],
  );

  return (
    <div className={clsx('slide-show-composable__players', className)} {...props}>
      <AntAvatar.Group>
        {playersIds.map((playerId) => (
          <Avatar id={players[playerId].avatarId} key={`slide-show-player-${playerId}`} />
        ))}
      </AntAvatar.Group>
      {children}
      <span className="slide-show-composable__players-names">{selectedPlayersNames}</span>
    </div>
  );
}
