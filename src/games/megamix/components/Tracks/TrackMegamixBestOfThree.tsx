// AntDesign Resources
import { Space } from 'antd';
// Hooks
import { useMock } from 'hooks/useMock';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { Card } from 'components/cards';
import { MinigameTitle } from '../MinigameTitle';
import { TransparentButton } from 'components/buttons';

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

        <Space className="space-container">
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
        </Space>
      </Space>
    </>
  );
};
