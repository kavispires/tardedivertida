import type { ReactNode } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useSortedPlayers } from 'hooks/useSortedPlayers';
// Icons
import { KnifeIcon } from 'icons/KnifeIcon';
import { LockIcon } from 'icons/LockIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { TransparentButton } from 'components/buttons/TransparentButton';
import { PlayerAvatarCard } from 'components/player/PlayerAvatarCard';
// Internal
import type { History } from '../utils/types';
import { isHistoryLocked } from '../utils/helpers';

type PlayersCardsProps = {
  setActivePlayerId: (id: UID) => void;
  guesses: PlainObject;
  players: GamePlayers;
  user: GamePlayer;
  history: History;
  children: ReactNode;
};

export function PlayersCards({
  setActivePlayerId,
  players,
  guesses,
  user,
  history,
  children,
}: PlayersCardsProps) {
  const sortedPlayers = useSortedPlayers(players);

  return (
    <div className="h-players-cards-container">
      <ul className="h-players-cards">
        {sortedPlayers.map((player) => {
          const isComplete =
            user.id === player.id || Boolean(guesses[player.id]?.weaponId && guesses[player.id]?.evidenceId);
          const isLocked = isHistoryLocked(history, player.id);
          return (
            <li key={`player-card-${player.id}`}>
              <TransparentButton
                onClick={() => setActivePlayerId(player.id)}
                // active={isActive}
                hoverType="tint"
                className="h-players-cards__button"
              >
                <PlayerAvatarCard
                  size="small"
                  player={player}
                  withName
                  className="h-players-cards__avatar"
                  replacementAvatar={
                    (isLocked && (
                      <IconAvatar
                        icon={<LockIcon />}
                        className="h-players-cards__seal"
                      />
                    )) ||
                    (isComplete && (
                      <IconAvatar
                        icon={<KnifeIcon />}
                        className="h-players-cards__seal"
                      />
                    ))
                  }
                />
              </TransparentButton>
            </li>
          );
        })}
      </ul>
      {children}
    </div>
  );
}
