import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Components
import { Translate } from 'components/language';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteOndaTelepatica({ playersList }: VoteComponentProps) {
  const groupedVotes = useMemo(() => {
    return groupBy(playersList, (player) => player.data.value);
  }, [playersList]);

  const getLabel = (value: string) => {
    if (value === 'center') {
      return (
        <Translate
          pt="Centro"
          en="Center"
        />
      );
    }
    if (value === 'left') {
      return (
        <Translate
          pt="Esquerda"
          en="Left"
        />
      );
    }
    if (value === 'right') {
      return (
        <Translate
          pt="Direita"
          en="Right"
        />
      );
    }
    return value;
  };

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {Object.entries(groupedVotes).map(([voteValue, voters]) => (
          <div
            key={`vote-group-${voteValue}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <div className="player-vote__value">{getLabel(voteValue)}</div>
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
