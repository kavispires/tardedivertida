import { orderBy } from 'lodash';
// Ant Design Resources
import { FallOutlined, RiseOutlined } from '@ant-design/icons';
// Icons
import { SpeechBubbleThumbsUpIcon } from 'icons/SpeechBubbleThumbsUpIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { IconAvatar } from 'components/avatars';
import { Achievements } from 'components/general/Achievements';
import achievementsReference from './utils/achievements';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  const playerCount = Object.keys(players).length;

  return (
    <GameOverWrapper announcementIcon={<TrophyIcon />} info={info} state={state} players={players}>
      <Achievements achievements={state.achievements} players={players} reference={achievementsReference} />

      <ul
        className="p-all-tweets"
        style={{ gridTemplateColumns: `repeat(${playerCount % 3 === 0 ? 3 : 5}, 1fr)` }}
      >
        {orderBy(state.allTweets, ['likes', 'text'], ['desc', 'asc']).map((tweet: PastTweet) => {
          const trended = tweet.likes > playerCount / 2;
          return (
            <li className="p-all-tweets__tweet" key={tweet.id}>
              <h3>
                {trended ? <RiseOutlined /> : <FallOutlined />} {tweet.text}
              </h3>
              <div className="p-all-tweets__comment">
                <IconAvatar icon={<SpeechBubbleThumbsUpIcon />} shape="square" className="p-like-icon" />{' '}
                {tweet.likes} <Translate pt="curtidas" en="likes" />
              </div>
              {}
            </li>
          );
        })}
      </ul>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
