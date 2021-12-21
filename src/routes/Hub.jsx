import React, { useEffect, useMemo } from 'react';
// Design Resources
import { Typography, Layout, Space, Divider, PageHeader, Button, message } from 'antd';
// API
import { signOut } from '../adapters/auth';
// Hooks
import { useGlobalState, useLanguage, useLocalStorage } from '../hooks';
// Utils
import gameList from '../resources/games.json';
// Components
import { LanguageSwitch, Translate } from '../components/shared';
import { DatabaseFilled } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { GameCard, RecentlyCreatedGames } from '../components/hub';

function Hub() {
  const language = useLanguage();
  const [getLocalStorage] = useLocalStorage();
  const [, setLanguage] = useGlobalState('language');
  const [, setIsAuthenticated] = useGlobalState('isAuthenticated');
  const history = useHistory();

  useEffect(() => {
    const prevLanguage = getLocalStorage('language');
    if (prevLanguage) {
      setLanguage(prevLanguage);
    }
  }, []); // eslint-disable-line

  const onSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);

      history.push('/');
    } catch (error) {
      message.error('Something went wrong', error);
    }
  };

  const { availableGames, comingSoonGames } = useMemo(() => {
    const sortedGameList = Object.values(gameList).sort((a, b) =>
      a.title[language] > b.title[language] ? 1 : -1
    );

    return sortedGameList.reduce(
      (acc, game) => {
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
    <Layout.Content className="container">
      <PageHeader
        title={
          <>
            <DatabaseFilled /> Hub
          </>
        }
        subTitle={<Translate pt="Selecione um jogo para começar" en="Select a game to start" />}
        extra={[
          <LanguageSwitch key="language-switch" />,
          <Button type="danger" ghost onClick={onSignOut} key="logout-button">
            Logout
          </Button>,
        ]}
      />
      <Divider />
      <RecentlyCreatedGames />
      <Divider />
      <Space size={[8, 16]} wrap align="start">
        {availableGames.map((game, index) => (
          <GameCard key={`${game.code}-${index}`} game={game} language={language} />
        ))}
      </Space>
      <Divider />
      <Typography.Title level={2}>
        <Translate pt="Em Breve" en="Coming Soon" />
      </Typography.Title>
      <Space size={[8, 16]} wrap align="start">
        {comingSoonGames.map((game, index) => (
          <GameCard key={`${game.code}-${index}`} game={game} language={language} />
        ))}
      </Space>
    </Layout.Content>
  );
}

export default Hub;
