// Ant Design Resources
import { CommentOutlined, LikeFilled, ShareAltOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Title } from 'components/text';
// Components
import { Topic } from './Topic';
import { TweetComment } from './TweetComment';

type StepResolutionProps = {
  players: GamePlayers;
  totalLikes: number;
  customTopic: string;
  currentTopic: Topic;
  goToNextStep: GenericFunction;
};
export function StepResolution({
  players,
  totalLikes,
  customTopic,
  currentTopic,
  goToNextStep,
}: StepResolutionProps) {
  return (
    <Step fullWidth className="p-step">
      <Title level={1}>
        <Translate pt="Resultado" en="Results" />
      </Title>

      <div className="p-tweet-container">
        <div className="p-tweet">
          <div className="p-tweet__topic">
            <Topic topic={customTopic ?? currentTopic?.text} />
          </div>
          <div className="p-tweet__actions">
            <div className="p-tweet__action" style={{ color: totalLikes > 0 ? 'DodgerBlue' : 'gray' }}>
              <LikeFilled className="p-tweet__icon" />
              {totalLikes}
            </div>
            <div className="p-tweet__action p-tweet__action-active">
              <CommentOutlined className="p-tweet__icon" /> <Translate pt="Comentários" en="Comments" />
            </div>
            <div className="p-tweet__action">
              <ShareAltOutlined className="p-tweet__icon" /> <Translate pt="Compartilhar" en="Share" />
            </div>
          </div>
        </div>

        <ul className="p-tweet-comments">
          {Object.values(players).map((player) => {
            const key = `player-result-${player.id}`;

            return (
              <li className="p-player-reaction" key={key}>
                <TweetComment player={player} totalLikes={totalLikes} />
              </li>
            );
          })}
        </ul>
      </div>

      <Space className="space-container" align="center">
        <TimedButton duration={25} showTimer onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>
    </Step>
  );
}
