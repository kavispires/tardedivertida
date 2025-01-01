// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Tweet } from 'components/game/SocialProfile';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackPolemicaDaVez = ({ track, onSubmitAnswer, user }: TrackProps) => {
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
        <RuleInstruction type="action">
          <Translate
            pt={
              <>
                Observe a twitada abaixo, qual a porcentagem de <strong>curtidas</strong> entre os jogadores
                você acha que ele ganhou?
              </>
            }
            en={
              <>
                Based on the tweet below, what percentage of <strong>likes</strong> among the players do you
                think it got?
              </>
            }
          />
        </RuleInstruction>

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

        <SpaceContainer>
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
        </SpaceContainer>
      </Space>
    </>
  );
};
