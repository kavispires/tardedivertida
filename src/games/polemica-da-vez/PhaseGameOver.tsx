import { orderBy } from 'lodash';
// Ant Design Resources
import { FallOutlined, RiseOutlined } from '@ant-design/icons';
// Components
import { AvatarIcon } from 'components/avatars';
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  const playerCount = Object.keys(players).length;

  return (
    <GameOverWrapper announcementIcon="trophy" info={info} state={state}>
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
                <AvatarIcon type="speech-bubble-thumbs-up" shape="square" className="p-like-icon" />{' '}
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
