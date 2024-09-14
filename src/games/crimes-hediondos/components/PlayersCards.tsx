// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Utils
import { sortPlayers } from 'utils/helpers';
// Icons
import { KnifeIcon } from 'icons/KnifeIcon';
import { LockIcon } from 'icons/LockIcon';
// Components
import { AvatarCard, IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
// Internal
import type { History } from '../utils/types';
import { isHistoryLocked } from '../utils/helpers';

type PlayersCardsProps = {
  activePlayerId: PlayerId;
  setActivePlayerId: GenericFunction;
  guesses: PlainObject;
  players: GamePlayers;
  user: GamePlayer;
  history: History;
};

export function PlayersCards({
  activePlayerId,
  setActivePlayerId,
  players,
  guesses,
  user,
  history,
}: PlayersCardsProps) {
  return (
    <ul className="h-players-cards">
      {sortPlayers(players).map((player) => {
        const isActive = activePlayerId === player.id;
        const isComplete =
          user.id === player.id || Boolean(guesses[player.id]?.weaponId && guesses[player.id]?.evidenceId);
        const isLocked = isHistoryLocked(history, player.id);
        return (
          <li key={`player-card-${player.id}`}>
            <TransparentButton onClick={() => setActivePlayerId(player.id)} active={isActive}>
              <AvatarCard
                size="small"
                player={player}
                withName
                replacementAvatar={
                  (isLocked && <IconAvatar icon={<LockIcon />} className="h-players-cards__seal" />) ||
                  (isComplete && <IconAvatar icon={<KnifeIcon />} className="h-players-cards__seal" />)
                }
              />
            </TransparentButton>
          </li>
        );
      })}
    </ul>
  );
}
