import clsx from 'clsx';
// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useSortedPlayers } from '@hooks/useSortedPlayers';
// Utils
import { getAnimationClass, getAvatarColorById } from '@utils/helpers';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
// Internal
import type { CardInHand } from '../utils/types';

type PlayersDreamsCountProps = {
  players: GamePlayers;
  playerInNightmareId?: UID;
};

export function PlayersDreamsCount({ players, playerInNightmareId }: PlayersDreamsCountProps) {
  const sortedPlayers = useSortedPlayers(players);

  return (
    <div className="g-players-dreams-count">
      <header className="g-players-dreams-count__title">
        <Translate
          en="Player Dream Count"
          pt="Sonhos por Jogador"
        />
      </header>
      <ul className="g-players-dreams-count__players">
        {sortedPlayers.map((player) => {
          const cards: CardInHand[] = Object.values(player.cards);
          const cardsLeft = cards.filter((card) => !card.used);
          const isPlayerInNightmare = player.id === playerInNightmareId;
          const showTooltip = isPlayerInNightmare && !player.fallen && cardsLeft.length > 0;

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
                  })}`,
              )}
              style={{ backgroundColor: getAvatarColorById(player.avatarId) }}
            >
              <Tooltip
                title={
                  showTooltip ? (
                    <div
                      className={getAnimationClass('tada', {
                        speed: 'fast',
                        infinite: true,
                      })}
                    >
                      {player.name}{' '}
                      <Translate
                        pt="está em um pesadelo!"
                        en="is in a nightmare"
                      />
                    </div>
                  ) : undefined
                }
                color="black"
                placement="bottom"
                open={showTooltip}
              >
                <PlayerAvatar
                  shape="square"
                  avatarId={player.avatarId}
                  alt={player.name}
                />

                <div
                  className={clsx(
                    'g-players-dreams-count__count',
                    player.fallen && 'g-players-dreams-count__count--fallen',
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
