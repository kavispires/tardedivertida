import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { FallOutlined, RiseOutlined } from '@ant-design/icons';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { SpeechBubbleThumbsUpIcon } from '@icons/SpeechBubbleThumbsUpIcon';
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { IconAvatar } from '@components/avatars/IconAvatar';
import { GameOverWrapper } from '@components/game-over/GameOverWrapper';
import { Achievements } from '@components/general/Achievements';
import { Translate } from '@components/language/Translate';
// Internal
import type { PastTweet, PhaseGameOverState } from './utils/types';
import achievementsReference from './utils/achievements';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const playerCount = Object.keys(players).length;

  const orderedTweets = useMemo(
    () => orderBy(state.allTweets, ['likes', 'text'], ['desc', 'asc']),
    [state.allTweets],
  );

  return (
    <GameOverWrapper
      announcementIcon={<TrophyIcon />}
      state={state}
      players={players}
    >
      <Achievements
        achievements={state.achievements}
        players={players}
        reference={achievementsReference}
      />

      <ul
        className="p-all-tweets"
        style={{ gridTemplateColumns: `repeat(${playerCount % 3 === 0 ? 3 : 5}, 1fr)` }}
      >
        {orderedTweets.map((tweet: PastTweet) => {
          const trended = tweet.likes > playerCount / 2;
          return (
            <li
              className="p-all-tweets__tweet"
              key={tweet.id}
            >
              <h3>
                {trended ? <RiseOutlined /> : <FallOutlined />} {tweet.text}
              </h3>
              <div className="p-all-tweets__comment">
                <IconAvatar
                  icon={<SpeechBubbleThumbsUpIcon />}
                  shape="square"
                  className="p-like-icon"
                />{' '}
                {tweet.likes}{' '}
                <Translate
                  pt="curtidas"
                  en="likes"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </GameOverWrapper>
  );
}
