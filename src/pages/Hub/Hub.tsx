import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { useTitle } from 'react-use';
// Ant Design Resources
import { DatabaseFilled } from '@ant-design/icons';
import { Typography, Layout, Divider, Row, Col, Tag, Flex } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
// Hooks
import { useGameList } from 'hooks/useGameList';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { SEPARATOR } from 'utils/constants';
import { calculateGameAverageDuration, isDevEnv } from 'utils/helpers';
// Components
import { LogoutButton } from 'components/auth/LogoutButton';
import { LanguageSwitch, Translate } from 'components/language';
import { PageLayout } from 'components/layout/PageLayout';
import { LoadingPage } from 'components/loaders';
// Pages
import { DevHeader } from 'pages/Dev/DevHeader';
// Internal
import { GameCard } from './components/GameCard';
import { DevEmulatorAlert } from './components/DevEmulatorAlert';
import { Filters, type FilterState } from './components/Filters';

const MECHANICS_RULES: Record<string, 'concurrent' | 'exclusive'> = {
  dynamics: 'exclusive',
  turns: 'exclusive',
  skills: 'concurrent',
  actions: 'concurrent',
  emotions: 'concurrent',
  features: 'concurrent',
  other: 'concurrent',
};

function Hub() {
  useTitle('Hub - Tarde Divertida');
  const { language } = useLanguage();
  const { data: gameListData = {}, isLoading } = useGameList();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tags: [],
    players: 0,
    recommendedWith: false,
    bestWith: false,
    duration: 0,
    releaseStatus: [],
    sortBy: 'title',
  });

  const statsCountsArray = useMemo(() => {
    return orderBy(
      Object.entries(
        Object.values(gameListData).reduce((acc: Record<string, number>, game) => {
          if (acc[game.gameCode] === undefined) {
            acc[game.gameCode] = 0;
          }
          acc[game.gameCode]++;
          return acc;
        }, {}),
      ).map(([gameCode, count]) => `${gameCode}: ${count}`),
    );
  }, [gameListData]);

  const gameList = useMemo(
    () =>
      Object.values(gameListData).filter((game) => {
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

          if (tagGroup && tag && MECHANICS_RULES?.[tagGroup] === 'exclusive') {
            result.push(game.mechanics.includes(tag));
          } else if (tag) {
            result.push(game.mechanics.includes(tag));
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
    [filters, gameListData],
  );

  const { stableGames, betaGames, devGames, comingSoonGames } = useMemo(() => {
    const sortedGameList = orderBy(gameList, [`title.[${language}]`], ['asc']);

    return sortedGameList.reduce(
      (
        acc: {
          stableGames: GameInfo[];
          betaGames: GameInfo[];
          devGames: GameInfo[];
          comingSoonGames: GameInfo[];
        },
        game,
      ) => {
        if (game.release === 'stable') {
          acc.stableGames.push(game);
        } else if (game.release === 'beta' && game.available === true) {
          acc.betaGames.push(game);
        } else if (game.release === 'dev' || game.release === 'beta') {
          // Dev games and beta games that are not available go to Under Development
          acc.devGames.push(game);
        } else {
          acc.comingSoonGames.push(game);
        }
        return acc;
      },
      {
        stableGames: [],
        betaGames: [],
        devGames: [],
        comingSoonGames: [],
      },
    );
  }, [gameList, language]);

  // Check if there's an active search
  const hasActiveSearch = Boolean(filters.search);

  // Helper to sort games by title in the active language or by release date
  const sortGamesByLanguage = (games: GameInfo[]) => {
    if (filters.sortBy === 'release-date') {
      return orderBy(games, ['releaseDate'], ['desc']); // Most recent first
    }
    return orderBy(games, [`title.${language}`], ['asc']);
  };

  if (isLoading) {
    return (
      <PageLayout className="dev-layout">
        <LoadingPage message={{ pt: 'Carregando lista de jogos...', en: 'Loading game list...' }} />
      </PageLayout>
    );
  }

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
        availabilityCount={stableGames.length}
      />

      <Layout.Content
        className="container"
        id="main-container"
      >
        {hasActiveSearch ? (
          // Show only search results when there's an active search
          <>
            <Typography.Title level={2}>
              <Translate
                pt="Resultados da Busca"
                en="Search Results"
              />
            </Typography.Title>
            <RowOfGames games={sortGamesByLanguage(gameList)} />
          </>
        ) : isDevEnv ? (
          // Development environment order
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
            <RowOfGames games={sortGamesByLanguage([...betaGames, ...devGames])} />
            <Divider />

            <Typography.Title level={2}>
              <Translate
                pt="Lançamentos Estáveis"
                en="Stable Releases"
              />
            </Typography.Title>
            <RowOfGames games={sortGamesByLanguage(stableGames)} />
            <Divider />

            <Typography.Title level={2}>
              <Translate
                pt="Em Breve"
                en="Coming Soon"
              />
            </Typography.Title>
            <RowOfGames games={sortGamesByLanguage(comingSoonGames)} />
          </>
        ) : (
          // Production environment order
          <>
            {betaGames.length > 0 && (
              <>
                <Typography.Title level={2}>
                  <Translate
                    pt="Beta"
                    en="Beta"
                  />
                </Typography.Title>
                <RowOfGames games={sortGamesByLanguage(betaGames)} />
                <Divider />
              </>
            )}

            <Typography.Title level={2}>
              <Translate
                pt="Lançamentos Estáveis"
                en="Stable Releases"
              />
            </Typography.Title>
            <RowOfGames games={sortGamesByLanguage(stableGames)} />
            <Divider />

            {devGames.length > 0 && (
              <>
                <Typography.Title level={2}>
                  <Translate
                    pt="Em Desenvolvimento"
                    en="Under Development"
                  />
                </Typography.Title>
                <RowOfGames games={sortGamesByLanguage(devGames)} />
                <Divider />
              </>
            )}

            <Typography.Title level={2}>
              <Translate
                pt="Em Breve"
                en="Coming Soon"
              />
            </Typography.Title>
            <RowOfGames games={sortGamesByLanguage(comingSoonGames)} />
          </>
        )}
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
            info={game}
            isAdmin={['dev', 'beta', 'stable'].includes(game.release)}
          />
        </Col>
      ))}
    </Row>
  );
}

export default Hub;
