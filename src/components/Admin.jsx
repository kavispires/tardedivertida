import React from 'react';
import { Typography, Layout, Space, Card, Image, Divider, Button } from 'antd';

import gameList from '../resources/games.json';

function Admin() {
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
                src={`${process.env.PUBLIC_URL}/images/banners/game-image-${game.image}.jpg`}
                fallback={`${process.env.PUBLIC_URL}/images/banners/game-image-em-breve.jpg`}
              />
            }
          >
            <Card.Meta title={game.title} description={game.summary} />
            <Divider />
            <Card.Meta description={game.playerCount} />
            <Divider />
            <Space>
              <Button type="default">Regras</Button>
              {Boolean(game.available) && <Button type="primary">Criar Jogo</Button>}
            </Space>
          </Card>
        ))}
      </Space>
    </Layout.Content>
  );
}

export default Admin;
