// Ant Design Resources
import { Space } from 'antd';
import { CommentOutlined, LikeFilled, ShareAltOutlined } from '@ant-design/icons';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { sortPlayers } from 'utils/helpers';
// Components
import { Tweet } from './components/Tweet';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { TweetComment } from './components/TweetComment';

type StepResolutionProps = {
  players: GamePlayers;
  totalLikes: number;
  customTweet: string;
  currentTweet: TextCard;
  goToNextStep: GenericFunction;
} & AnnouncementProps;

export function StepResolution({
  players,
  totalLikes,
  customTweet,
  currentTweet,
  goToNextStep,
  announcement,
}: StepResolutionProps) {
  useTemporarilyHidePlayersBar();

  return (
    <Step fullWidth className="p-step" announcement={announcement}>
      <Title>
        <Translate pt="Resultado" en="Results" />
      </Title>

      <div className="p-tweet-container">
        <div className="p-tweet">
          <div className="p-tweet__tweet">
            <Tweet tweet={customTweet ?? currentTweet?.text} />
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
          {sortPlayers(players).map((player) => {
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
        <TimedButton duration={20} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>
    </Step>
  );
}
