import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce, useTitle } from 'react-use';
// Ant Design Resources
import { Typography, Layout, Space, Divider, Button, message, Popconfirm } from 'antd';
import { DatabaseFilled } from '@ant-design/icons';
// API
import { signOut } from 'services/firebase';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLocalStorage } from 'hooks/useLocalStorage';
// Utils
import GAME_LIST from 'utils/info';
// Components
import { GameCard } from './components/GameCard';
import { LanguageSwitch, Translate } from 'components/language';
import { DevHeader } from 'pages/Dev/DevHeader';
import { DevEmulatorAlert } from './components/DevEmulatorAlert';
import { Filters } from './components/Filters';
import { SEPARATOR, TAG_RULES } from 'utils/constants';
import { calculateGameAverageDuration } from 'utils/helpers';

// const TAGS_BY_TAG_GROUP = Object.keys(TAG_DICT).reduce((acc: Record<string, string[]>, key) => {
//   if (acc[TAG_DICT[key].group] === undefined) {
//     acc[TAG_DICT[key].group] = [];
//   }
//   acc[TAG_DICT[key].group].push(key);
//   return acc;
// }, {});

function Hub() {
  useTitle('Hub - Tarde Divertida');

  const navigate = useNavigate();
  const { language } = useLanguage();
  const [getLocalStorage] = useLocalStorage();
  const [, setLanguage] = useGlobalState('language');
  const [, setIsAuthenticated] = useGlobalState('isAuthenticated');
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [numberFilters, setNumberFilters] = useState<NumberDictionary>({});

  useEffectOnce(() => {
    const prevLanguage = getLocalStorage('language');
    if (prevLanguage) {
      setLanguage(prevLanguage);
    }
  });

  const onSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);

      navigate('/');
    } catch (error: any) {
      message.error('Something went wrong', error);
    }
  };

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
          <Popconfirm
            title={<Translate pt="Tem certeza?" en="Are you sure?" />}
            onConfirm={onSignOut}
            key="logout-button"
          >
            <Button danger ghost key="logout-button" size="small">
              Logout
            </Button>
          </Popconfirm>,
        ]}
      />

      <DevEmulatorAlert />

      <Filters
        setTagFilters={setTagFilters}
        setNumberFilters={setNumberFilters}
        availabilityCount={availableGames.length}
      />

      <Layout.Content className="container" id="main-container">
        <Space size={[8, 16]} wrap align="start" className="game-card-collection">
          {availableGames.map((game: GameInfo, index: number) => (
            <GameCard key={`${game.gameCode}-${index}`} game={game} />
          ))}
        </Space>
        <Divider />
        <Typography.Title level={2}>
          <Translate pt="Em Desenvolvimento" en="Under Development" />
        </Typography.Title>
        <Space size={[8, 16]} wrap align="start" className="game-card-collection">
          {devGames.map((game: GameInfo, index: number) => (
            <GameCard key={`${game.gameCode}-${index}`} game={game} />
          ))}
        </Space>
        <Divider />
        <Typography.Title level={2}>
          <Translate pt="Em Breve" en="Coming Soon" />
        </Typography.Title>
        <Space size={[8, 16]} wrap align="start" className="game-card-collection">
          {comingSoonGames.map((game: GameInfo, index: number) => (
            <GameCard key={`${game.gameCode}-${index}`} game={game} />
          ))}
        </Space>
      </Layout.Content>
    </Layout>
  );
}

export default Hub;
