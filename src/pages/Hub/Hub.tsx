import { useMemo } from 'react';
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
import { RecentlyCreatedGames } from './components/RecentlyCreatedGames';
import { GameCard } from './components/GameCard';
import { LanguageSwitch, Translate } from 'components/language';
import { DevHeader } from 'pages/Dev/DevHeader';
import { DevEmulatorAlert } from './components/DevEmulatorAlert';

function Hub() {
  useTitle('Hub - Tarde Divertida');

  const navigate = useNavigate();
  const { language } = useLanguage();
  const [getLocalStorage] = useLocalStorage();
  const [, setLanguage] = useGlobalState('language');
  const [, setIsAuthenticated] = useGlobalState('isAuthenticated');

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

  const { availableGames, comingSoonGames } = useMemo(() => {
    const sortedGameList = Object.values(GAME_LIST).sort((a, b) =>
      a.title[language] > b.title[language] ? 1 : -1
    );

    return sortedGameList.reduce(
      (acc: any, game) => {
        if (game.available[language]) {
          acc.availableGames.push(game);
        } else {
          acc.comingSoonGames.push(game);
        }
        return acc;
      },
      {
        availableGames: [],
        comingSoonGames: [],
      }
    );
  }, [language]);

  return (
    <Layout style={{ background: 'none' }}>
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

      <Layout.Content className="container">
        <RecentlyCreatedGames />
        <Divider />
        <Space size={[8, 16]} wrap align="start">
          {availableGames.map((game: GameInfo, index: number) => (
            <GameCard key={`${game.gameCode}-${index}`} game={game} />
          ))}
        </Space>
        <Divider />
        <Typography.Title level={2}>
          <Translate pt="Em Breve" en="Coming Soon" />
        </Typography.Title>
        <Space size={[8, 16]} wrap align="start">
          {comingSoonGames.map((game: GameInfo, index: number) => (
            <GameCard key={`${game.gameCode}-${index}`} game={game} />
          ))}
        </Space>
      </Layout.Content>
    </Layout>
  );
}

export default Hub;
