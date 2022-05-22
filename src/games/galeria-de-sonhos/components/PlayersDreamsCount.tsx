import { Tooltip } from 'antd';
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
  return (
    <div className="g-players-dreams-count">
      <header className="g-players-dreams-count__title">
        <Translate en="Player Dream Count" pt="Sonhos por Jogador" />
      </header>
      <ul className="g-players-dreams-count__players">
        {Object.values(players).map((player) => {
          const cards: GCardInHand[] = Object.values(player.cards);
          const cardsLeft = cards.filter((card) => !card.used);
          const isPlayerInNightmare = player.id === playerInNightmareId;
          const showTooltip = isPlayerInNightmare && !player.fallen;

          return (
            <span
              key={`player-dream-count-${player.id}`}
              className={clsx(
                'g-players-dreams-count__player',
                isPlayerInNightmare &&
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
              <Tooltip
                title={
                  showTooltip ? (
                    <div className={getAnimationClass('tada', undefined, 'fast', true)}>
                      {player.name} <Translate pt="tá em apuros!" en="is in danger" />
                    </div>
                  ) : undefined
                }
                color="black"
                placement="bottom"
                visible={showTooltip}
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
              </Tooltip>
            </span>
          );
        })}
      </ul>
    </div>
  );
}
