import { orderBy } from 'lodash';
// Components
import { AvatarCard, AvatarIcon, TransparentButton } from 'components';

type PlayersCardsProps = {
  activePlayerId: PlayerId;
  setActivePlayerId: GenericFunction;
  guesses: PlainObject;
  players: GamePlayers;
  user: GamePlayer;
};

export function PlayersCards({
  activePlayerId,
  setActivePlayerId,
  players,
  guesses,
  user,
}: PlayersCardsProps) {
  return (
    <ul className="h-players-cards">
      {orderBy(Object.values(players), ['name']).map((player) => {
        const isActive = activePlayerId === player.id;
        const isComplete =
          user.id === player.id || Boolean(guesses[player.id]?.weaponId && guesses[player.id]?.evidenceId);
        return (
          <li key={`player-card-${player.id}`}>
            <TransparentButton onClick={() => setActivePlayerId(player.id)} active={isActive}>
              <AvatarCard
                size="small"
                player={player}
                withName
                replacementAvatar={
                  isComplete && <AvatarIcon type="knife" className="h-players-cards__seal" />
                }
              />
            </TransparentButton>
          </li>
        );
      })}
    </ul>
  );
}
