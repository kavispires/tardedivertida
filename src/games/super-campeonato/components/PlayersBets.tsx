import clsx from 'clsx';
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
import { getAvatarColorById } from 'utils/helpers';
import { findBetContenders, getContenderIdsByTier } from '../utils/helpers';
import { ContenderCard } from './ContenderCard';

type PlayersBetsProps = {
  players: GamePlayers;
  brackets: WBracket[];
};

export function PlayersBets({ players, brackets }: PlayersBetsProps) {
  const playersList = orderBy(Object.values(players), 'name');
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
  brackets: WBracket[];
  contendersByTiers: WContenderByTier;
};

function PlayersBetEntry({ player, brackets, contendersByTiers }: PlayersBetEntryProps) {
  const { quarterCard, semiCard, finalCard, selectedCard } = useMemo(
    () => findBetContenders(brackets, player.bets, player.selectedContenderId),
    [brackets, player.bets, player.selectedContenderId]
  );

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
          contendersByTiers.winner[finalCard!.id] && 'w-players-bets__square--win'
        )}
      >
        <ContenderCard
          size={50}
          overlayColor={contendersByTiers.winner[finalCard!.id] ? 'yellow' : 'gray'}
          contender={finalCard!}
          hideName
        />
      </div>
      <div
        className={clsx(
          'w-players-bets__square',
          contendersByTiers.final[semiCard!.id] && 'w-players-bets__square--win'
        )}
      >
        <ContenderCard
          size={50}
          overlayColor={contendersByTiers.final[semiCard!.id] ? 'yellow' : 'gray'}
          contender={semiCard!}
          hideName
        />
      </div>
      <div
        className={clsx(
          'w-players-bets__square',
          contendersByTiers.semi[quarterCard!.id] && 'w-players-bets__square--win'
        )}
      >
        <ContenderCard
          size={50}
          overlayColor={contendersByTiers.semi[quarterCard!.id] ? 'yellow' : 'gray'}
          contender={quarterCard!}
          hideName
        />
      </div>
      {selectedCard ? (
        <div
          className={clsx(
            'w-players-bets__square',
            contendersByTiers.winner[selectedCard!.id] && 'w-players-bets__square--win'
          )}
        >
          <ContenderCard
            size={50}
            overlayColor={contendersByTiers.winner[selectedCard!.id] ? 'yellow' : 'gray'}
            contender={selectedCard!}
            hideName
          />
        </div>
      ) : (
        <div className={clsx('w-players-bets__square', 'w-players-bets__square--none')}>-</div>
      )}
    </li>
  );
}
