// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { ItemData } from 'types/tdr';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { ItemCard } from '@components/cards/ItemCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { Text } from '@components/text/Text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackDuetos = ({ track, onSubmitAnswer }: TrackProps) => {
  const { isLoading } = useLoading();

  const options: { id: string; pair: [ItemData, ItemData] }[] = track.data.pairs;

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(options, 'id'));
  });

  return (
    <>
      <MinigameTitle track={track} />
      <RuleInstruction type="action">
        <Translate
          pt="Qual dos pares abaixo faz mais sentido?"
          en="Which of the pairs below makes the most sense?"
        />
      </RuleInstruction>

      <SpaceContainer>
        {options.map((entry) => (
          <TransparentButton
            key={entry.id}
            onClick={() => onSelect(entry.id)}
            disabled={isLoading}
          >
            <Flex
              gap={8}
              justify="center"
              align="center"
              className="contained bg-black"
            >
              <ItemCard
                itemId={entry.pair[0].id}
                width={64}
              />
              <Text>+</Text>
              <ItemCard
                itemId={entry.pair[1].id}
                width={64}
              />
            </Flex>
          </TransparentButton>
        ))}
      </SpaceContainer>
    </>
  );
};
