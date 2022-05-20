import clsx from 'clsx';
// Helpers

// Colors
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
import { getAnimationClass, getAvatarColorById } from 'utils/helpers';

type PlayersDreamsCountProps = {
  players: Players;
  playerInNightmareId?: PlayerId;
};

export function PlayersDreamsCount({ players, playerInNightmareId }: PlayersDreamsCountProps) {
  console.log({ playerInNightmareId });
  return (
    <div className="g-players-dreams-count">
      <header className="g-players-dreams-count__title">
        <Translate en="Player Dream Count" pt="Sonhos por Jogador" />
      </header>
      <ul className="g-players-dreams-count__players">
        {Object.values(players).map((player) => {
          const cards: GCardInHand[] = Object.values(player.cards);
          const cardsLeft = cards.filter((card) => !card.used);

          return (
            <span
              key={`player-dream-count-${player.id}`}
              className={clsx(
                'g-players-dreams-count__player',
                player.id === playerInNightmareId &&
                  !player.fallen &&
                  `g-players-dreams-count__player--nightmare ${getAnimationClass(
                    'pulse',
                    undefined,
                    'faster',
                    false,
                    3
                  )}`
              )}
              style={{ backgroundColor: getAvatarColorById(player.avatarId) }}
            >
              <Avatar shape="square" id={player.avatarId} alt={player.name} />
              <div
                className={clsx(
                  'g-players-dreams-count__count',
                  player.fallen && 'g-players-dreams-count__count--fallen'
                )}
              >
                {cardsLeft.length}
              </div>
            </span>
          );
        })}
      </ul>
    </div>
  );
}
