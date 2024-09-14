import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { getAnimationClass, getAvatarColorById, sortPlayers } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
// Internal
import type { CardInHand } from '../utils/types';

type PlayersDreamsCountProps = {
  players: GamePlayers;
  playerInNightmareId?: PlayerId;
};

export function PlayersDreamsCount({ players, playerInNightmareId }: PlayersDreamsCountProps) {
  const sortedPlayers = useMemo(() => sortPlayers(players), [players]);

  return (
    <div className="g-players-dreams-count">
      <header className="g-players-dreams-count__title">
        <Translate en="Player Dream Count" pt="Sonhos por Jogador" />
      </header>
      <ul className="g-players-dreams-count__players">
        {sortedPlayers.map((player) => {
          const cards: CardInHand[] = Object.values(player.cards);
          const cardsLeft = cards.filter((card) => !card.used);
          const isPlayerInNightmare = player.id === playerInNightmareId;
          const showTooltip = isPlayerInNightmare && (!player.fallen || cardsLeft.length > 0);

          return (
            <span
              key={`player-dream-count-${player.id}`}
              className={clsx(
                'g-players-dreams-count__player',
                isPlayerInNightmare &&
                  !player.fallen &&
                  `g-players-dreams-count__player--nightmare ${getAnimationClass('pulse', {
                    speed: 'faster',
                    repeat: 3,
                  })}`
              )}
              style={{ backgroundColor: getAvatarColorById(player.avatarId) }}
            >
              <Tooltip
                title={
                  showTooltip ? (
                    <div className={getAnimationClass('tada', { speed: 'fast', infinite: true })}>
                      {player.name} <Translate pt="tá em apuros!" en="is in danger" />
                    </div>
                  ) : undefined
                }
                color="black"
                placement="bottom"
                open={showTooltip}
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
