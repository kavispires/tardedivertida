import { orderBy } from 'lodash';
// Ant Design Resources
import { FallOutlined, RiseOutlined } from '@ant-design/icons';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { IconAvatar } from 'components/icons/IconAvatar';
import { SpeechBubbleThumbsUpIcon } from 'components/icons/SpeechBubbleThumbsUpIcon';
import { TrophyIcon } from 'components/icons/TrophyIcon';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  const playerCount = Object.keys(players).length;

  return (
    <GameOverWrapper announcementIcon={<TrophyIcon />} info={info} state={state}>
      <ul
        className="p-all-topics"
        style={{ gridTemplateColumns: `repeat(${playerCount % 3 === 0 ? 3 : 5}, 1fr)` }}
      >
        {orderBy(state.allTopics, ['likes', 'text'], ['desc', 'asc']).map((topic: PastTopic) => {
          const trended = topic.likes > playerCount / 2;
          return (
            <li className="p-all-topics__topic" key={topic.id}>
              <h3>
                {trended ? <RiseOutlined /> : <FallOutlined />} {topic.text}
              </h3>
              <div className="p-all-topics__comment">
                <IconAvatar icon={<SpeechBubbleThumbsUpIcon />} shape="square" className="p-like-icon" />{' '}
                {topic.likes} <Translate pt="curtidas" en="likes" />
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
