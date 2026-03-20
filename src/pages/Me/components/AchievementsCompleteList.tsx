import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Flex, Row, Select, Switch } from 'antd';
// Types
import type { AchievementInfo } from 'types/game';
import type { GameUserStatistics } from 'types/user';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useGameList, usePlayableGames } from 'hooks/useGameList';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import ACHIEVEMENTS_DICT from 'utils/achievements';
// Components
import { VirtualizationWrapper } from 'components/general/VirtualizationWrapper';
import { Translate } from 'components/language';
// Internal
import { AchievementCard } from './AchievementCard';

type AchievementEntry = {
  gameName: string;
  achievementId: string;
  achievement: AchievementInfo;
  count: number;
};

type AchievementsCompleteListProps = {
  playedGames: Record<string, GameUserStatistics>;
};

export function AchievementsCompleteList({ playedGames }: AchievementsCompleteListProps) {
  const { language } = useLanguage();
  const cardWidth = useCardWidth(8, { maxWidth: 256, minWidth: 128 });
  const { data: gameList = {} } = useGameList();
  const { data: playableGames = {} } = usePlayableGames();
  const [order, setOrder] = useState('gameName');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  const allAchievements = useMemo(() => {
    return Object.keys(playableGames).flatMap((gameName) => {
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
  }, [playableGames]);

  const sortedAchievements = useMemo(() => {
    return orderBy(
      allAchievements.map((achievement) => {
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
            return gameList[o.gameName]?.title[language].toLowerCase() || '';
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
  }, [playedGames, orderDirection, order, language, allAchievements, gameList]);

  return (
    <Flex
      vertical
      gap={8}
    >
      <Flex
        align="center"
        gap={8}
      >
        <span>
          <Translate
            pt="Ordenar por:"
            en="Sort by:"
          />
        </span>
        <Select
          options={[
            {
              value: 'gameName',
              label: (
                <Translate
                  pt="Jogo"
                  en="Game"
                />
              ),
            },
            {
              value: 'achievementName',
              label: (
                <Translate
                  pt="Medalha"
                  en="Achievement"
                />
              ),
            },
            {
              value: 'count',
              label: (
                <Translate
                  pt="Conquistas"
                  en="Medals"
                />
              ),
            },
          ]}
          value={order}
          onChange={(value) => setOrder(value)}
          defaultValue="gameName"
          style={{ width: 150 }}
        />
        <Switch
          checked={orderDirection === 'asc'}
          onChange={(checked) => setOrderDirection(checked ? 'asc' : 'desc')}
          checkedChildren="A-Z"
          unCheckedChildren="Z-A"
        />
      </Flex>
      <Row gutter={16}>
        {sortedAchievements.map((entry) => {
          const { gameName } = entry;
          return (
            <VirtualizationWrapper
              key={`${gameName}-${entry.achievementId}`}
              width={cardWidth}
              aspectRatio="9:16"
            >
              <AchievementCard
                gameName={gameName}
                gameTitle={gameList[gameName]?.title || { en: '', pt: '' }}
                achievement={entry.achievement}
                value={entry.count}
                width={cardWidth}
              />
            </VirtualizationWrapper>
          );
        })}
      </Row>
    </Flex>
  );
}
