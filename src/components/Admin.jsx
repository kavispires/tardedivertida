import React, { useEffect, useState } from 'react';
import { Typography, Layout, Space, Card, Image, Divider, Button, Tag } from 'antd';

import gameList from '../resources/games.json';
import { PUBLIC_URL, TAG_DICT } from '../utils/constants';
import CreateGameModal from './modals/CreateGameModal';
import RulesModal from './modals/RulesModal';
import { GAME_API } from '../adapters';

function Admin() {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isRulesModalVisible, setRulesModalVisible] = useState(false);
  const [gameInfo, setGameInfo] = useState({});

  const handleCreateGame = (game) => {
    setGameInfo(game);
    setCreateModalVisible(true);
  };

  const handleOpenRules = (game) => {
    setGameInfo(game);
    setRulesModalVisible(true);
  };

  const onCloseModal = () => {
    setCreateModalVisible(false);
    setRulesModalVisible(false);
  };

  useEffect(() => {
    async function run() {
      const res = await GAME_API.helloWorld('yvolanda');
      console.log(res);
    }
    run();
  }, []);

  console.log();

  return (
    <Layout.Content className="container">
      <Typography.Title>Admin Hub</Typography.Title>
      <Typography.Paragraph>Select the game you want to start</Typography.Paragraph>

      <Space size={[8, 16]} wrap align="start">
        {Object.values(gameList).map((game) => (
          <Card
            key={game.title}
            hoverable
            style={{ width: 240 }}
            cover={
              <Image
                alt={game.title}
                src={`${PUBLIC_URL.BANNERS}game-image-${game.image}.jpg`}
                fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve.jpg`}
              />
            }
          >
            <Card.Meta title={game.title} description={game.summary} />
            <Divider />
            <Card.Meta description={game.playerCount} />
            <Divider />
            <Space wrap size={[1, 6]}>
              {game.tags.map((tag) => (
                <Tag key={`${game.id}-${tag}`} color={TAG_DICT[tag]?.color}>
                  {TAG_DICT[tag]?.label}
                </Tag>
              ))}
            </Space>
            <Divider />
            <Space>
              <Button type="default" onClick={() => handleOpenRules(game)}>
                Regras
              </Button>
              {Boolean(game.available) && (
                <Button type="primary" onClick={() => handleCreateGame(game)}>
                  Criar Jogo
                </Button>
              )}
            </Space>
          </Card>
        ))}
      </Space>

      {isCreateModalVisible && (
        <CreateGameModal isVisible={isCreateModalVisible} gameInfo={gameInfo} onCloseModal={onCloseModal} />
      )}

      {isRulesModalVisible && (
        <RulesModal isVisible={isRulesModalVisible} gameInfo={gameInfo} onCloseModal={onCloseModal} />
      )}
    </Layout.Content>
  );
}

export default Admin;
