import clsx from 'clsx';
import { useMemo } from 'react';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Utils
import { getAvatarColorById, sortPlayers } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { CharacterCard } from 'components/cards/CharacterCard';
import { Translate } from 'components/language';
// Internal
import type { Bracket, ContenderByTier } from '../utils/type';
import { findBetContenders, getContenderIdsByTier } from '../utils/helpers';

type PlayersBetsProps = {
  players: GamePlayers;
  brackets: Bracket[];
};

export function PlayersBets({ players, brackets }: PlayersBetsProps) {
  const playersList = sortPlayers(players);
  const contendersByTiers = getContenderIdsByTier(brackets);
  return (
    <ul className="w-players-bets" style={{ gridTemplateColumns: `repeat(${playersList.length + 1}, auto)` }}>
      <li className="w-players-bets__player w-players-bets__player--header">
        <div className="w-players-bets__square">
          <Avatar shape="square" size="large" className="w-players-bets__avatar" id="N" />
        </div>
        <div className="w-players-bets__square">
          <Translate pt="Final" en="Final" />
        </div>
        <div className="w-players-bets__square">
          <Translate pt="Semi" en="Semi" />
        </div>
        <div className="w-players-bets__square">
          <Translate pt="Quartas" en="Quarter" />
        </div>
        <div className="w-players-bets__square">
          <Translate pt="Competidor" en="Contender" />
        </div>
      </li>

      {playersList.map((player) => (
        <PlayersBetEntry
          key={`players-bets-${player.id}`}
          brackets={brackets}
          player={player}
          contendersByTiers={contendersByTiers}
        />
      ))}
    </ul>
  );
}
type PlayersBetEntryProps = {
  player: GamePlayer;
  brackets: Bracket[];
  contendersByTiers: ContenderByTier;
};

function PlayersBetEntry({ player, brackets, contendersByTiers }: PlayersBetEntryProps) {
  const { quarterCard, semiCard, finalCard, selectedCard } = useMemo(
    () => findBetContenders(brackets, player.bets, player.selectedContenderId),
    [brackets, player.bets, player.selectedContenderId],
  );

  if (!quarterCard || !semiCard || !finalCard) {
    return null;
  }

  return (
    <li
      key={`players-bets-${player.id}`}
      className="w-players-bets__player"
      style={{ backgroundColor: getAvatarColorById(player.avatarId) }}
    >
      <div className="w-players-bets__square">
        <Avatar shape="square" size="large" className="w-players-bets__avatar" id={player.avatarId} />
      </div>

      <div
        className={clsx(
          'w-players-bets__square',
          contendersByTiers.winner[finalCard.id] && 'w-players-bets__square--win',
        )}
      >
        <CharacterCard
          size={50}
          overlayColor={contendersByTiers.winner[finalCard.id] ? 'yellow' : 'gray'}
          character={finalCard}
          hideName
        />
      </div>
      <div
        className={clsx(
          'w-players-bets__square',
          contendersByTiers.final[semiCard.id] && 'w-players-bets__square--win',
        )}
      >
        <CharacterCard
          size={50}
          overlayColor={contendersByTiers.final[semiCard.id] ? 'yellow' : 'gray'}
          character={semiCard}
          hideName
        />
      </div>
      <div
        className={clsx(
          'w-players-bets__square',
          contendersByTiers.semi[quarterCard.id] && 'w-players-bets__square--win',
        )}
      >
        <CharacterCard
          size={50}
          overlayColor={contendersByTiers.semi[quarterCard.id] ? 'yellow' : 'gray'}
          character={quarterCard}
          hideName
        />
      </div>
      {selectedCard ? (
        <div
          className={clsx(
            'w-players-bets__square',
            contendersByTiers.winner[selectedCard.id] && 'w-players-bets__square--win',
          )}
        >
          <CharacterCard
            size={50}
            overlayColor={contendersByTiers.winner[selectedCard.id] ? 'yellow' : 'gray'}
            character={selectedCard}
            hideName
          />
        </div>
      ) : (
        <div className={clsx('w-players-bets__square', 'w-players-bets__square--none')}>-</div>
      )}
    </li>
  );
}
