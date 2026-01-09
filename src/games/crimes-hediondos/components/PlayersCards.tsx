import type { ReactNode } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Utils
import { sortPlayers } from 'utils/helpers';
// Icons
import { KnifeIcon } from 'icons/KnifeIcon';
import { LockIcon } from 'icons/LockIcon';
// Components
import { PlayerAvatarCard, IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
// Internal
import type { History } from '../utils/types';
import { isHistoryLocked } from '../utils/helpers';

type PlayersCardsProps = {
  setActivePlayerId: (id: PlayerId) => void;
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
  return (
    <div className="h-players-cards-container">
      <ul className="h-players-cards">
        {sortPlayers(players).map((player) => {
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
