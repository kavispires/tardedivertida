import { orderBy } from 'lodash';
import { DevHeader } from 'pages/Dev/DevHeader';
import { useMemo, useState } from 'react';
import { useTitle } from 'react-use';
// Ant Design Resources
import { DatabaseFilled } from '@ant-design/icons';
import { Typography, Layout, Divider, Row, Col } from 'antd';
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
// Internal
import { GameCard } from './components/GameCard';
import { DevEmulatorAlert } from './components/DevEmulatorAlert';
import { Filters } from './components/Filters';

function Hub() {
  useTitle('Hub - Tarde Divertida');
  const { language } = useLanguage();
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [numberFilters, setNumberFilters] = useState<NumberDictionary>({});

  const gameList = useMemo(
    () =>
      Object.values(GAME_LIST).filter((game) => {
        let result = [];

        // Check player count
        if (numberFilters.players) {
          result.push(
            game.playerCount.min <= numberFilters.players && game.playerCount.max >= numberFilters.players
          );

          if (numberFilters.bestWith) {
            result.push(numberFilters.players === game.playerCount.best);
          }

          if (numberFilters.recommendedWith) {
            result.push(game.playerCount.recommended.includes(numberFilters.players));
          }
        }

        // Check tags
        // TODO: this does not account for tagGroups and concurrent tags
        tagFilters.forEach((tagKey) => {
          const [tagGroup, tag] = tagKey.split(SEPARATOR);

          if (tagGroup && tag && TAG_RULES?.[tagGroup] === 'exclusive') {
            result.push(game.tags.includes(tag));
          } else if (tag) {
            result.push(game.tags.includes(tag));
          }
        });

        // Check time
        if (numberFilters.duration) {
          const duration = calculateGameAverageDuration(game, numberFilters.players ?? 0);

          if (numberFilters.players) {
            result.push(
              numberFilters.duration >= duration.customTime - 10 &&
                numberFilters.duration <= duration.customTime + 10
            );
          } else {
            result.push(numberFilters.duration >= duration.min && numberFilters.duration <= duration.max);
          }
        }

        return result.every(Boolean);
      }),
    [tagFilters, numberFilters]
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
        game
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
      }
    );
  }, [gameList, language]);
  return (
    <Layout className="dev-layout">
      <DevHeader
        title={
          <>
            <DatabaseFilled /> Hub
          </>
        }
        subTitle={<Translate pt="Selecione um jogo para começar" en="Select a game to start" />}
        extra={[
          <LanguageSwitch key="language-switch" />,
          <LogoutButton key="logout-button" danger ghost size="small" />,
        ]}
      />

      <DevEmulatorAlert />

      <Filters
        setTagFilters={setTagFilters}
        setNumberFilters={setNumberFilters}
        availabilityCount={availableGames.length}
      />

      <Layout.Content className="container" id="main-container">
        {isDevEnv && (
          <>
            <Typography.Title level={2}>
              <Translate pt="Em Desenvolvimento" en="Under Development" />
            </Typography.Title>
            <RowOfGames games={devGames} />
            <Divider />
          </>
        )}
        <Typography.Title level={2}>
          <Translate pt="Disponíveis" en="Available" />
        </Typography.Title>
        <RowOfGames games={availableGames} />

        <Divider />
        {!isDevEnv && (
          <>
            <Typography.Title level={2}>
              <Translate pt="Em Desenvolvimento" en="Under Development" />
            </Typography.Title>
            <RowOfGames games={devGames} />

            <Divider />
          </>
        )}
        <Typography.Title level={2}>
          <Translate pt="Em Breve" en="Coming Soon" />
        </Typography.Title>
        <RowOfGames games={comingSoonGames} />
      </Layout.Content>
    </Layout>
  );
}

type RowOfGamesProps = {
  games: GameInfo[];
};

function RowOfGames({ games }: RowOfGamesProps) {
  if (games.length === 0) {
    return (
      <Typography.Text type="secondary">
        <Translate pt="Nenhum jogo encontrado nessa categoria" en="No games found in this category" />
      </Typography.Text>
    );
  }

  return (
    <Row gutter={[8, 16]}>
      {games.map((game: GameInfo) => (
        <Col key={game.gameName} xs={24} sm={12} md={8} lg={8} xl={6} xxl={4}>
          <GameCard game={game} isAdmin={['dev', 'beta', 'stable'].includes(game.release)} />
        </Col>
      ))}
    </Row>
  );
}

export default Hub;
