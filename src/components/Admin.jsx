import React from 'react';

// Design Resources
import { Typography, Layout, Space, Card, Image, Divider, Tag } from 'antd';
// Utils
import gameList from '../resources/games.json';
import { PUBLIC_URL, TAG_DICT } from '../utils/constants';
// Components
import CreateGameModal from './modals/CreateGameModal';
import RulesModal from './modals/RulesModal';

function Admin() {
  return (
    <Layout.Content className="container">
      <Typography.Title>Admin Hub</Typography.Title>
      <Typography.Paragraph>Select the game you want to start</Typography.Paragraph>

      <Space size={[8, 16]} wrap align="start">
        {Object.values(gameList).map((game) => (
          <Card
            key={game.gameName}
            hoverable
            style={{ width: 240 }}
            cover={
              <Image
                alt={game.title}
                src={`${PUBLIC_URL.BANNERS}game-image-${game.gameName}.jpg`}
                fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve.jpg`}
              />
            }
          >
            <Card.Meta title={game.title} description={game.summary} />
            <Divider />
            <Card.Meta description={`Para ${game.min}-${game.max} jogadores`} />
            <Card.Meta description={`Recomendado jogar com ${game.recommended}`} />
            <Divider />
            <Space wrap size={[1, 6]}>
              {game.tags.map((tag) => (
                <Tag key={`${game.gameCode}-${tag}`} color={TAG_DICT[tag]?.color}>
                  {TAG_DICT[tag]?.label}
                </Tag>
              ))}
            </Space>
            <Divider />
            <Space>
              <RulesModal gameInfo={game} />
              {Boolean(game.available) && <CreateGameModal gameInfo={game} />}
            </Space>
          </Card>
        ))}
      </Space>
    </Layout.Content>
  );
}

export default Admin;
