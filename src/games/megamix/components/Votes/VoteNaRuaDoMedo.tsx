import { HouseCard } from 'games/na-rua-do-medo/components/HouseCard';
import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Utils
import { LETTERS } from 'utils/constants';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteNaRuaDoMedo({ track, playersList }: VoteComponentProps) {
  const groupedVotes = useMemo(() => {
    return groupBy(playersList, (player) => player.data.value);
  }, [playersList]);

  if (track.variant === 'house') {
    return (
      <SpacePlayerCheckWrapper
        playersList={playersList}
        paths={['data.value']}
      >
        <div className="vote-groups">
          {Object.entries(groupedVotes).map(([houseId, voters]) => {
            const house = track.data.options.find((entry: PlainObject) => entry.id === houseId);
            return (
              <div
                key={`vote-group-${houseId}`}
                className="vote-groups__group"
              >
                <div className="vote-groups__target">
                  <HouseCard
                    card={house}
                    candyLeftover={0}
                    preview={false}
                  />
                </div>

                <Voters voters={voters} />
              </div>
            );
          })}
        </div>
      </SpacePlayerCheckWrapper>
    );
  }

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {Object.entries(groupedVotes).map(([letterIndex, voters]) => (
          <div
            key={`vote-group-${letterIndex}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <div className="player-vote__value">{LETTERS[Number(letterIndex)]}</div>
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
