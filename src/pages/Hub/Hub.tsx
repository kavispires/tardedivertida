import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { useTitle } from 'react-use';
// Ant Design Resources
import { DatabaseFilled } from '@ant-design/icons';
import { Typography, Layout, Divider, Row, Col, Tag, Flex } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { SEPARATOR, TAG_RULES } from 'utils/constants';
import { calculateGameAverageDuration, isDevEnv } from 'utils/helpers';
import GAME_LIST from 'utils/info';
// Components
import { LogoutButton } from 'components/auth/LogoutButton';
import { LanguageSwitch, Translate } from 'components/language';
import { PageLayout } from 'components/layout/PageLayout';
// Pages
import { DevHeader } from 'pages/Dev/DevHeader';
// Internal
import { GameCard } from './components/GameCard';
import { DevEmulatorAlert } from './components/DevEmulatorAlert';
import { Filters, type FilterState } from './components/Filters';

const statsCountsArray = orderBy(
  Object.entries(
    Object.values(GAME_LIST).reduce((acc: Record<string, number>, game) => {
      if (acc[game.gameCode] === undefined) {
        acc[game.gameCode] = 0;
      }
      acc[game.gameCode]++;
      return acc;
    }, {}),
  ).map(([gameCode, count]) => `${gameCode}: ${count}`),
);

function Hub() {
  useTitle('Hub - Tarde Divertida');
  const { language } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tags: [],
    players: 0,
    recommendedWith: false,
    bestWith: false,
    duration: 0,
    releaseStatus: [],
  });

  const gameList = useMemo(
    () =>
      Object.values(GAME_LIST).filter((game) => {
        const result = [];

        // Search by title (PT/EN) or game name
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesTitle =
            game.title.pt.toLowerCase().includes(searchLower) ||
            game.title.en.toLowerCase().includes(searchLower);
          const matchesGameName = game.gameName.toLowerCase().includes(searchLower);
          const matchesPopularName =
            game.popularName.pt.toLowerCase().includes(searchLower) ||
            game.popularName.en.toLowerCase().includes(searchLower);
          const matchesGameCode = game.gameCode.toLowerCase().includes(searchLower);

          if (!matchesTitle && !matchesGameName && !matchesPopularName && !matchesGameCode) {
            return false;
          }
        }

        // Check player count
        if (filters.players) {
          result.push(game.playerCount.min <= filters.players && game.playerCount.max >= filters.players);

          if (filters.bestWith) {
            result.push(filters.players === game.playerCount.best);
          }

          if (filters.recommendedWith) {
            result.push(game.playerCount.recommended.includes(filters.players));
          }
        }

        // Check tags
        filters.tags.forEach((tagKey) => {
          const [tagGroup, tag] = tagKey.split(SEPARATOR);

          if (tagGroup && tag && TAG_RULES?.[tagGroup] === 'exclusive') {
            result.push(game.tags.includes(tag));
          } else if (tag) {
            result.push(game.tags.includes(tag));
          }
        });

        // Check time
        if (filters.duration) {
          const duration = calculateGameAverageDuration(game, filters.players ?? 0);

          if (filters.players) {
            result.push(
              filters.duration >= duration.customTime - 10 && filters.duration <= duration.customTime + 10,
            );
          } else {
            result.push(filters.duration >= duration.min && filters.duration <= duration.max);
          }
        }

        // Check release status
        if (filters.releaseStatus.length > 0) {
          const matchesStatus = filters.releaseStatus.some((status) => {
            if (status === 'stable') {
              return game.release === 'stable';
            }
            if (status === 'dev') {
              return ['dev', 'beta'].includes(game.release);
            }
            if (status === 'soon') {
              return !['stable', 'dev', 'beta'].includes(game.release);
            }
            return false;
          });

          if (!matchesStatus) {
            return false;
          }
        }

        return result.every(Boolean);
      }),
    [filters],
  );

  const { availableGames, comingSoonGames, devGames } = useMemo(() => {
    const sortedGameList = orderBy(gameList, [`title.[${language}]`], ['asc']);

    return sortedGameList.reduce(
      (
        acc: {
          availableGames: GameInfo[];
          devGames: GameInfo[];
          comingSoonGames: GameInfo[];
        },
        game,
      ) => {
        if (['stable'].includes(game.release)) {
          acc.availableGames.push(game);
        } else if (['dev', 'beta'].includes(game.release)) {
          acc.devGames.push(game);
        } else {
          acc.comingSoonGames.push(game);
        }
        return acc;
      },
      {
        availableGames: [],
        devGames: [],
        comingSoonGames: [],
      },
    );
  }, [gameList, language]);
  return (
    <PageLayout className="dev-layout">
      <DevHeader
        title={
          <>
            <DatabaseFilled /> Hub
          </>
        }
        subTitle={
          <Translate
            pt="Selecione um jogo para começar"
            en="Select a game to start"
          />
        }
        extra={[
          <LanguageSwitch key="language-switch" />,
          <LogoutButton
            key="logout-button"
            danger
            ghost
            size="small"
          />,
        ]}
      />

      <DevEmulatorAlert />

      <Filters
        filters={filters}
        setFilters={setFilters}
        availabilityCount={availableGames.length}
      />

      <Layout.Content
        className="container"
        id="main-container"
      >
        {isDevEnv && (
          <>
            <Typography.Title level={2}>
              <Translate
                pt="Em Desenvolvimento"
                en="Under Development"
              />
            </Typography.Title>
            <Typography.Paragraph>
              <Flex
                gap={6}
                align="center"
                wrap="wrap"
              >
                {statsCountsArray.map((e) => (
                  <Tag key={e}>{e}</Tag>
                ))}
              </Flex>
            </Typography.Paragraph>
            <RowOfGames games={devGames} />
            <Divider />
          </>
        )}
        <Typography.Title level={2}>
          <Translate
            pt="Disponíveis"
            en="Available"
          />
        </Typography.Title>
        <RowOfGames games={availableGames} />

        <Divider />
        {!isDevEnv && (
          <>
            <Typography.Title level={2}>
              <Translate
                pt="Em Desenvolvimento"
                en="Under Development"
              />
            </Typography.Title>
            <RowOfGames games={devGames} />

            <Divider />
          </>
        )}
        <Typography.Title level={2}>
          <Translate
            pt="Em Breve"
            en="Coming Soon"
          />
        </Typography.Title>
        <RowOfGames games={comingSoonGames} />
      </Layout.Content>
    </PageLayout>
  );
}

type RowOfGamesProps = {
  games: GameInfo[];
};

function RowOfGames({ games }: RowOfGamesProps) {
  if (games.length === 0) {
    return (
      <Typography.Text type="secondary">
        <Translate
          pt="Nenhum jogo encontrado nessa categoria"
          en="No games found in this category"
        />
      </Typography.Text>
    );
  }

  return (
    <Row gutter={[8, 16]}>
      {games.map((game: GameInfo) => (
        <Col
          key={game.gameName}
          xs={24}
          sm={12}
          md={8}
          lg={8}
          xl={6}
          xxl={4}
        >
          <GameCard
            game={game}
            isAdmin={['dev', 'beta', 'stable'].includes(game.release)}
          />
        </Col>
      ))}
    </Row>
  );
}

export default Hub;
