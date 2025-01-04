import type { TextProps } from 'antd/es/typography/Text';
import clsx from 'clsx';
import { type ReactNode, useMemo } from 'react';
// Ant Design Resources
import { CrownFilled, MessageFilled } from '@ant-design/icons';
import { Avatar as AntAvatar, Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { getContrastColor, getPlayerNamesFromIds } from 'utils/helpers';
// Icons
import { GarbageIcon } from 'icons/GarbageIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';

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
  /**
   * Extra content to be displayed on the right
   */
  extra?: ReactNode;
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
  extra,
  ...props
}: SlideShowBubbleProps) {
  return (
    <div
      className={clsx('slide-show-composable__bubble-value', className)}
      style={winner && backgroundColor ? { backgroundColor, color: getContrastColor(backgroundColor) } : {}}
      {...props}
    >
      {winner ? (
        <CrownFilled
          className="slide-show-composable__bubble-icon"
          style={backgroundColor ? { color: getContrastColor(backgroundColor) } : {}}
        />
      ) : (
        <MessageFilled className="slide-show-composable__bubble-icon" />
      )}

      <span>{children}</span>

      <span>{extra}</span>
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

type SlideShowNoWinsProps = TextProps & {
  /**
   * Custom icon to replace the garbage icon.
   */
  icon?: ReactNode;
};

/**
 * SlideShowNoWins displays a message indicating that no one won in the slide show.
 */
export function SlideShowNoWins({ children, icon, className, ...props }: SlideShowNoWinsProps) {
  return (
    <Typography.Text className={clsx('slide-show-composable__no-wins', className)} {...props}>
      <IconAvatar icon={icon ?? <GarbageIcon />} size="large" shape="square" />
      <div>
        <Translate pt="Nossa, ninguém acertou." en="Wow, nobody got it." />
        <br />
        {children}
      </div>
    </Typography.Text>
  );
}
