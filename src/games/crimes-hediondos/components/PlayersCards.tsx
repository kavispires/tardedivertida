// Helpers
import { isHistoryLocked } from '../utils/helpers';
import { sortPlayers } from 'utils/helpers';
// Components
import { AvatarCard } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { IconAvatar } from 'components/icons/IconAvatar';
import { LockIcon } from 'components/icons/LockIcon';
import { KnifeIcon } from 'components/icons/KnifeIcon';

type PlayersCardsProps = {
  activePlayerId: PlayerId;
  setActivePlayerId: GenericFunction;
  guesses: PlainObject;
  players: GamePlayers;
  user: GamePlayer;
  history: HHistory;
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
