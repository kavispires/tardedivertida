// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackMegamixBestOfThree = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const { translate } = useLanguage();
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
      <Space direction="vertical" align="center" className="contained margin">
        <Card header={translate('Pergunta', 'Question')} color="orange">
          {track.data.card.question}
        </Card>

        <SpaceContainer>
          <TransparentButton onClick={() => onSelect(0)} disabled={isLoading || user.ready}>
            <Card header="A" color="red">
              {track.data.card.options[0]}
            </Card>
          </TransparentButton>

          <TransparentButton onClick={() => onSelect(1)} disabled={isLoading || user.ready}>
            <Card header="B" color="purple">
              {track.data.card.options[1]}
            </Card>
          </TransparentButton>

          <TransparentButton onClick={() => onSelect(2)} disabled={isLoading || user.ready}>
            <Card header="C" color="blue">
              {track.data.card.options[2]}
            </Card>
          </TransparentButton>
        </SpaceContainer>
      </Space>
    </>
  );
};
