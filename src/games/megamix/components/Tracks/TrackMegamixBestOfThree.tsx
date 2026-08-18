// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { TextCard } from '@components/cards/TextCard';
import { SpaceContainer } from '@components/layout/SpaceContainer';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackMegamixBestOfThree = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (index: number) => {
    onSubmitAnswer({
      data: { value: String(index) },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection([0, 1, 2]));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Melhor de 3', en: 'Best of 3' }} />
      <Space
        orientation="vertical"
        align="center"
        className="contained margin"
      >
        <TextCard color="orange">{track.data.card.question}</TextCard>

        <SpaceContainer>
          <TransparentButton
            onClick={() => onSelect(0)}
            disabled={isLoading || user.ready}
          >
            <TextCard
              header="A"
              color="red"
            >
              {track.data.card.options[0]}
            </TextCard>
          </TransparentButton>

          <TransparentButton
            onClick={() => onSelect(1)}
            disabled={isLoading || user.ready}
          >
            <TextCard
              header="B"
              color="purple"
            >
              {track.data.card.options[1]}
            </TextCard>
          </TransparentButton>

          <TransparentButton
            onClick={() => onSelect(2)}
            disabled={isLoading || user.ready}
          >
            <TextCard
              header="C"
              color="blue"
            >
              {track.data.card.options[2]}
            </TextCard>
          </TransparentButton>
        </SpaceContainer>
      </Space>
    </>
  );
};
