import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SplatterSVG } from '../Tracks/TrackPalhetaDeFores';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VotePalhetaDeCores({ playersList }: VoteComponentProps) {
  const groupedVotes = useMemo(() => {
    return groupBy(playersList, (player) => player.data.value);
  }, [playersList]);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {Object.entries(groupedVotes).map(([color, voters]) => (
          <div
            key={`vote-group-${color}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <SplatterSVG
                color={color}
                style={{ color }}
                width={48}
              />
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
