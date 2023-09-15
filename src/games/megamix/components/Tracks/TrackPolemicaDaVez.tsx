// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';
import { SocialProfile } from '../SocialProfile';

export const TrackPolemicaDaVez = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: number) => {
    onSubmitAnswer({
      data: { value: String(value) },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.options));
  });

  return (
    <>
      <MinigameTitle title={{ pt: '', en: '' }} />
      <Instruction contained>
        <Translate
          pt={<>Observe o tópico abaixo, quantas curtidas você acha que ele ganhou?</>}
          en={<>How many likes did this trending topic get?</>}
        />
      </Instruction>

      <div className="tweet">
        <SocialProfile avatarId="A" name="Bob" handle="@bob" verified />
        <span className="tweet__text">{track.data.card.text}</span>
      </div>

      <Space className="space-container">
        {track.data.options.map((option: number) => {
          return (
            <Button
              key={`option-${option}`}
              onClick={() => onSelect(option)}
              size="large"
              disabled={isLoading || user.ready}
              type="primary"
              shape="circle"
            >
              {option}
            </Button>
          );
        })}
      </Space>
    </>
  );
};
