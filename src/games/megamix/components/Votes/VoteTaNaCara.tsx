import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteTaNaCara({ playersList }: VoteComponentProps) {
  const groupedVotes = useMemo(() => {
    return groupBy(playersList, (player) => player.data.value);
  }, [playersList]);

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
              {voteValue === 'yes' ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
