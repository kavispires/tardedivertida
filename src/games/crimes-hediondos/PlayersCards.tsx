import { orderBy } from 'lodash';
// Helpers
import { isHistoryLocked } from './helpers';
// Components
import { AvatarCard, AvatarIcon, TransparentButton } from 'components';

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
      {orderBy(Object.values(players), ['name']).map((player) => {
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
                  (isLocked && <AvatarIcon type="lock" className="h-players-cards__seal" />) ||
                  (isComplete && <AvatarIcon type="knife" className="h-players-cards__seal" />)
                }
              />
            </TransparentButton>
          </li>
        );
      })}
    </ul>
  );
}
