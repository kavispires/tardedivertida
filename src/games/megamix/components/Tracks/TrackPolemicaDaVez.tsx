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
import { Tweet } from 'components/game/SocialProfile';

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
      <MinigameTitle title={{ pt: 'Polêmica da Vez', en: "That's Polemic" }} />
      <Space direction="vertical" align="center" className="contained margin">
        <Instruction contained>
          <Translate
            pt={
              <>
                Observe o tópico abaixo, qual a porcentagem de <strong>curtidas</strong> entre os jogadores
                você acha que ele ganhou?
              </>
            }
            en={
              <>
                Based on the topic below, what percentage of <strong>likes</strong> among the players do you
                think it got?
              </>
            }
          />
        </Instruction>

        <Tweet
          avatarId="A"
          name="Bob"
          handle="@imnotarobot"
          verified
          onLike={() => {}}
          onDislike={() => {}}
          disabled
        >
          {track.data.card.text}
        </Tweet>

        <Space className="space-container">
          {track.data.options.map((option: number) => {
            return (
              <Button
                key={`option-${option}`}
                onClick={() => onSelect(option)}
                size="large"
                disabled={isLoading || user.ready}
                type="primary"
                shape="round"
              >
                {option}%
              </Button>
            );
          })}
        </Space>
      </Space>
    </>
  );
};
