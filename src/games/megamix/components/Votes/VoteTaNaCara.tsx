// Components
import {
  AnswerKindaNoButton,
  AnswerMaybeYesButton,
  AnswerNoButton,
  AnswerYesButton,
} from '@components/buttons/AnswerButtons';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteTaNaCara({ playersList }: VoteComponentProps) {
  const groupedVotes = useGroupedVotes(playersList);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {groupedVotes.map(([voteValue, voters]) => (
          <div
            key={`vote-group-${voteValue}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              {voteValue === '-2' && <AnswerNoButton />}
              {voteValue === '-1' && <AnswerKindaNoButton />}
              {voteValue === '1' && <AnswerMaybeYesButton />}
              {voteValue === '2' && <AnswerYesButton />}
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
