import type { TextProps } from 'antd/es/typography/Text';
import clsx from 'clsx';
import { type ReactNode, useMemo } from 'react';
// Ant Design Resources
import { CrownFilled, MessageFilled } from '@ant-design/icons';
import { Avatar, Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Utils
import { getContrastColor, getPlayerNamesFromIds } from '@utils/helpers';
// Icons
import { GarbageIcon } from '@icons/GarbageIcon';
// Components
import { IconAvatar } from '@components/avatars/IconAvatar';
import { Translate } from '@components/language/Translate';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
// Internal
import styles from './styles';

/**
 * Label component for slide show content
 */
export function SlideShowLabel({ children, className, ...props }: ElementPropsWithChildren) {
  return (
    <div
      className={clsx(styles.slideShowComposable__label, className)}
      {...props}
    >
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
 * Bubble value component for slide show that displays a value with optional winner crown icon
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
      className={clsx(styles.slideShowComposable__bubbleValue, className)}
      style={winner && backgroundColor ? { backgroundColor, color: getContrastColor(backgroundColor) } : {}}
      {...props}
    >
      {winner ? (
        <CrownFilled
          className={styles.slideShowComposable__bubbleIcon}
          style={backgroundColor ? { color: getContrastColor(backgroundColor) } : {}}
        />
      ) : (
        <MessageFilled className={styles.slideShowComposable__bubbleIcon} />
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
  playersIds: UID[];
} & ElementProps;

/**
 * Component that displays a list of player avatars and names in a slide show
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
    <div
      className={clsx(styles.slideShowComposable__players, className)}
      {...props}
    >
      <Avatar.Group>
        {playersIds.map((playerId) => (
          <PlayerAvatar
            avatarId={players[playerId].avatarId}
            key={`slide-show-player-${playerId}`}
          />
        ))}
      </Avatar.Group>
      {children}
      <span className={styles.slideShowComposable__playersNames}>{selectedPlayersNames}</span>
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
 * Component that displays a message indicating no one won in the slide show
 */
export function SlideShowNoWins({ children, icon, className, ...props }: SlideShowNoWinsProps) {
  return (
    <Typography.Text
      className={clsx(styles.slideShowComposable__noWins, className)}
      {...props}
    >
      <IconAvatar
        icon={icon ?? <GarbageIcon />}
        size="large"
        shape="square"
      />
      <div>
        <Translate
          pt="Nossa, ninguém acertou."
          en="Wow, nobody got it."
        />
        <br />
        {children}
      </div>
    </Typography.Text>
  );
}
