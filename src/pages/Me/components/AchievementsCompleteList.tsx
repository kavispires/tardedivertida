import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Flex, Row, Select, Switch } from 'antd';
// Types
import type { AchievementInfo } from 'types/achievements';
import type { GameUserStatistics } from 'types/user';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import ACHIEVEMENTS_DICT from 'utils/achievements';
import GAME_LIST from 'utils/info';
// Components
import { Translate } from 'components/language';
// Internal
import { playableGames } from '../utils';
import { AchievementCard } from './AchievementCard';

type AchievementEntry = {
  gameName: string;
  achievementId: string;
  achievement: AchievementInfo;
  count: number;
};

const ALL_ACHIEVEMENTS: AchievementEntry[] = Object.keys(playableGames).flatMap((gameName) => {
  const gameAchievements = ACHIEVEMENTS_DICT?.[gameName] || {};

  return Object.keys(gameAchievements).map((achievementId) => {
    return {
      gameName,
      achievementId,
      achievement: gameAchievements[achievementId],
      count: 0,
    };
  });
});

type AchievementsCompleteListProps = {
  playedGames: Record<string, GameUserStatistics>;
};

export function AchievementsCompleteList({ playedGames }: AchievementsCompleteListProps) {
  const { language } = useLanguage();
  const cardWidth = useCardWidth(8, { maxWidth: 256, minWidth: 128 });
  const [order, setOrder] = useState('gameName');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  const sortedAchievements = useMemo(() => {
    return orderBy(
      ALL_ACHIEVEMENTS.map((achievement) => {
        const gameStats = playedGames[achievement.gameName];

        const count = gameStats?.achievements?.[achievement.achievementId] || 0;
        return {
          ...achievement,
          count,
        };
      }),
      [
        (o: AchievementEntry) => {
          if (order === 'gameName') {
            return GAME_LIST[o.gameName].title[language].toLowerCase();
          }
          if (order === 'count') {
            return o.count;
          }
          return o.achievement.title[language].toLowerCase();
        },
        (o: AchievementEntry) => o.achievement.title[language].toLowerCase(),
      ],
      [orderDirection],
    );
  }, [playedGames, orderDirection, order, language]);

  return (
    <Flex vertical gap={8}>
      <Flex align="center" gap={8}>
        <span>
          <Translate pt="Ordenar por:" en="Sort by:" />
        </span>
        <Select
          options={[
            { value: 'gameName', label: <Translate pt="Jogo" en="Game" /> },
            { value: 'achievementName', label: <Translate pt="Medalha" en="Achievement" /> },
            { value: 'count', label: <Translate pt="Conquistas" en="Medals" /> },
          ]}
          value={order}
          onChange={(value) => setOrder(value)}
          defaultValue="gameName"
          style={{ width: 150 }}
        />
        <Switch
          checked={orderDirection === 'asc'}
          onChange={(checked) => setOrderDirection(checked ? 'asc' : 'desc')}
          checkedChildren={<Translate pt="Crescente" en="Ascending" />}
          unCheckedChildren={<Translate pt="Decrescente" en="Descending" />}
        />
      </Flex>
      <Row gutter={8}>
        {sortedAchievements.map((entry) => {
          const { gameName } = entry;
          return (
            <AchievementCard
              key={`${gameName}-${entry.achievementId}`}
              gameName={gameName}
              gameTitle={GAME_LIST[gameName].title}
              achievement={entry.achievement}
              value={entry.count}
              width={cardWidth}
            />
          );
        })}
      </Row>
    </Flex>
  );
}
