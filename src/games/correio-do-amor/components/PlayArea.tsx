import clsx from 'clsx';
import { type ReactNode, useMemo } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Icons
import { NoIcon } from '@icons/NoIcon';
import { SpeechBubbleHeartIcon } from '@icons/SpeechBubbleHeartIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayerFlex } from '@components/player/PlayerFlex';
// Internal
import { PLAYER_STATUS } from '../utils/constants';

type PlayAreaProps = {
  players: GamePlayers;
  gameOrder: GameOrder;
  activePlayerId: UID;
  user: GamePlayer;
  children?: ReactNode;
  userArea?: ReactNode;
};

export function PlayArea({ players, gameOrder, activePlayerId, user, children, userArea }: PlayAreaProps) {
  // Using the turn order, move the order under user is the one right before the middle, divide the players into two groups (left and right) and render them on the sides of the play area, with the active player in the middle
  const { leftIds, rightIds } = useMemo(() => {
    if (!gameOrder || gameOrder.length === 0) {
      return { leftIds: [], rightIds: [] };
    }

    const userIndex = gameOrder.indexOf(user.id);

    // Fallback: If user is somehow not in the order (e.g., spectator mode)
    if (userIndex === -1) {
      const mid = Math.floor(gameOrder.length / 2);
      return {
        leftIds: gameOrder.slice(0, mid),
        rightIds: gameOrder.slice(mid),
      };
    }

    const numPlayers = gameOrder.length;
    const numOpponents = numPlayers - 1;

    // Split the opponents. If odd (e.g., 3 opponents), the right side
    // (next players) gets the extra player via Math.ceil
    const leftCount = Math.floor(numOpponents / 2);
    const rightCount = Math.ceil(numOpponents / 2);

    const leftIds: string[] = [];
    const rightIds: string[] = [];

    // 1. Left Side: Players playing BEFORE the user
    // We iterate backwards, but unshift/push in a way that keeps chronological order
    // Example: P2 plays, then P3 plays.
    for (let i = leftCount; i > 0; i--) {
      // Adding numPlayers ensures we don't get negative modulo results
      const prevIndex = (userIndex - i + numPlayers) % numPlayers;
      leftIds.push(gameOrder[prevIndex]);
    }

    // 2. Right Side: Players playing AFTER the user
    // Example: P5 plays next, then P1 plays.
    for (let i = 1; i <= rightCount; i++) {
      const nextIndex = (userIndex + i) % numPlayers;
      rightIds.push(gameOrder[nextIndex]);
    }

    return { leftIds, rightIds };
  }, [gameOrder, user.id]);

  return (
    <div className="a-play-area">
      <div className="a-play-area__players-left">
        {leftIds.map((id) => (
          <PlayerEntry
            key={id}
            player={players[id]}
            isActive={id === activePlayerId}
          />
        ))}
      </div>
      <div className="a-play-area__center">{children}</div>
      <div className="a-play-area__players-right">
        {rightIds.map((id) => (
          <PlayerEntry
            key={id}
            player={players[id]}
            isActive={id === activePlayerId}
          />
        ))}
      </div>
      <div />
      <div className="a-play-area__user-area">
        <PlayerEntry
          player={user}
          isActive={user.id === activePlayerId}
        />

        {userArea}
      </div>
      <div />
    </div>
  );
}

function PlayerEntry({ player, isActive }: { player: GamePlayer; isActive: boolean }) {
  return (
    <PlayerFlex
      className={clsx('a-play-area__player-entry', { 'a-play-area__player-entry--active': isActive })}
      avatarId={player.avatarId}
      withBorder
      vertical
    >
      <PlayerAvatarName
        player={player}
        contrastText
      />
      <div className="a-play-area__player-entry-content">
        {player.status === PLAYER_STATUS.ELIMINATED ? (
          <span
            className={clsx(
              'a-play-area__player-entry-status',
              'a-play-area__player-entry-status--ELIMINATED',
            )}
          >
            <Icon
              icon={<NoIcon />}
              size="small"
            />
            <Translate
              pt="Eliminado"
              en="Eliminated"
            />
          </span>
        ) : (
          <span
            className={clsx('a-play-area__player-entry-status', 'a-play-area__player-entry-status--ACTIVE')}
          >
            <Icon
              icon={<SpeechBubbleHeartIcon />}
              size="small"
            />
            <Translate
              pt="Ainda no jogo"
              en="Still Playing"
            />
          </span>
        )}
      </div>
    </PlayerFlex>
  );
}
