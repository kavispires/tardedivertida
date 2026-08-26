// Ant Design Resources
import { Flex, Tooltip } from 'antd';
// Components
import { ItemCard } from '@components/cards/ItemCard';
import { Text } from '@components/text/Text';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { useGroupedVotes } from '../../utils/useGroupedVotes';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteDuetos({ playersList }: VoteComponentProps) {
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
              <Tooltip title={voteValue}>
                <div className="player-vote__value">
                  <Value value={voteValue} />
                </div>
              </Tooltip>
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}

function Value({ value }: { value: string }) {
  const [item1Id, item2Id] = value.split('-');
  return (
    <Flex
      gap={8}
      justify="center"
      align="center"
      className="contained bg-black"
    >
      <ItemCard
        itemId={item1Id}
        width={48}
      />
      <Text>+</Text>
      <ItemCard
        itemId={item2Id}
        width={48}
      />
    </Flex>
  );
}
