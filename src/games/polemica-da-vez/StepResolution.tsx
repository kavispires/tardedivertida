// Ant Design Resources
import { CommentOutlined, LikeFilled, ShareAltOutlined, TrophyOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import type { UseStep } from 'hooks/useStep';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { sortPlayers } from 'utils/helpers';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import { Tweet } from './components/Tweet';
import { TweetComment } from './components/TweetComment';

type StepResolutionProps = {
  players: GamePlayers;
  totalLikes: number;
  customTweet: string;
  currentTweet: TextCard;
  goToNextStep: UseStep['goToNextStep'];
} & Pick<StepProps, 'announcement'>;

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
      <StepTitle>
        <Translate pt="Resultado" en="Results" />
      </StepTitle>

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

      <SpaceContainer>
        <TimedButton duration={20} onExpire={goToNextStep} onClick={goToNextStep} icon={<TrophyOutlined />}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
