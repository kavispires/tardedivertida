import { useMemo, useState } from 'react';
import { useEffectOnce, useTitle } from 'react-use';
// Ant Design Resources
import { Typography, Layout, Divider, Row, Col } from 'antd';
import { DatabaseFilled } from '@ant-design/icons';

// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLocalStorage } from 'hooks/useLocalStorage';
// Utils
import GAME_LIST from 'utils/info';
import { SEPARATOR, TAG_RULES } from 'utils/constants';
import { calculateGameAverageDuration, isDevEnv } from 'utils/helpers';
// Components
import { GameCard } from './components/GameCard';
import { LanguageSwitch, Translate } from 'components/language';
import { DevHeader } from 'pages/Dev/DevHeader';
import { DevEmulatorAlert } from './components/DevEmulatorAlert';
import { Filters } from './components/Filters';
import { LogoutButton } from 'components/auth/LogoutButton';

// Players migration
const migrationBlocked = [
  'comunicacao-alienigena',
  'espiao-entre-nos',
  'linhas-cruzadas',
  'megamix',
  'na-rua-do-medo',
  'onda-telepatica',
  'polemica-da-vez',
  'retrato-falado',
  'sonhos-pesadelos',
  'super-campeonato',
  'testemunha-ocular',
  'ta-na-cara',
];

function Hub() {
  useTitle('Hub - Tarde Divertida');

  const { language } = useLanguage();
  const [getLocalStorage] = useLocalStorage();
  const [, setLanguage] = useGlobalState('language');
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [numberFilters, setNumberFilters] = useState<NumberDictionary>({});

  useEffectOnce(() => {
    const prevLanguage = getLocalStorage('language');
    if (prevLanguage) {
      setLanguage(prevLanguage);
    }
  });

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
    const sortedGameList = gameList.sort((a, b) => (a.title[language] > b.title[language] ? 1 : -1));

    return sortedGameList.reduce(
      (acc: any, game) => {
        if (game.available[language]) {
          if (['alpha', 'dev'].includes(game.version) || game.version.startsWith('beta')) {
            acc.devGames.push(game);
          } else {
            acc.availableGames.push(game);
          }
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
            <Row gutter={[8, 16]}>
              {devGames.map((game: GameInfo) => (
                <Col key={game.gameName} xs={24} sm={12} md={8} lg={6} xl={4}>
                  <GameCard game={game} />
                </Col>
              ))}
            </Row>
            <Divider />
          </>
        )}
        <Typography.Title level={2}>
          <Translate pt="Disponíveis" en="Available" />
        </Typography.Title>
        <Row gutter={[8, 16]}>
          {availableGames.map((game: GameInfo) => (
            <Col key={game.gameName} xs={24} sm={12} md={8} lg={6} xl={4}>
              <GameCard game={game} isAdmin={!migrationBlocked.includes(game.gameName)} />
            </Col>
          ))}
        </Row>
        {/* </Space> */}
        <Divider />
        {!isDevEnv && (
          <>
            <Typography.Title level={2}>
              <Translate pt="Em Desenvolvimento" en="Under Development" />
            </Typography.Title>
            <Row gutter={[8, 16]}>
              {devGames.map((game: GameInfo) => (
                <Col key={game.gameName} xs={24} sm={12} md={8} lg={6} xl={4}>
                  <GameCard game={game} />
                </Col>
              ))}
            </Row>
            <Divider />
          </>
        )}
        <Typography.Title level={2}>
          <Translate pt="Em Breve" en="Coming Soon" />
        </Typography.Title>
        <Row gutter={[8, 16]}>
          {comingSoonGames.map((game: GameInfo) => (
            <Col key={game.gameName} xs={24} sm={12} md={8} lg={6} xl={4}>
              <GameCard game={game} />
            </Col>
          ))}
        </Row>
      </Layout.Content>
    </Layout>
  );
}

export default Hub;
