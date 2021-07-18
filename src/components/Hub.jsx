import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Typography, Layout, Space, Card, Image, Divider, Tag } from 'antd';
// Utils
import gameList from '../resources/games.json';
import { PUBLIC_URL, TAG_DICT } from '../utils/constants';
import { orderBy } from '../utils';
// Components
import { CreateGameModal, RulesModal } from './modals';

function GameCard({ game }) {
  return (
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
  );
}

GameCard.propTypes = {
  game: PropTypes.shape({
    available: PropTypes.bool,
    gameCode: PropTypes.string,
    gameName: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    recommended: PropTypes.string,
    summary: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
  }),
};

function Hub() {
  const sortedGameList = orderBy(Object.values(gameList), ['available', 'title'], ['desc', 'asc']);

  const { availableGames, comingSoonGames } = sortedGameList.reduce(
    (acc, game) => {
      if (game.available) {
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

  return (
    <Layout.Content className="container">
      <Typography.Title>Hub</Typography.Title>

      <Typography.Paragraph>Selecione um jogo para começar</Typography.Paragraph>
      <Space size={[8, 16]} wrap align="start">
        {availableGames.map((game) => (
          <GameCard key={game.code} game={game} />
        ))}
      </Space>

      <Typography.Title level={2}>Em Breve</Typography.Title>
      <Space size={[8, 16]} wrap align="start">
        {comingSoonGames.map((game) => (
          <GameCard key={game.code} game={game} />
        ))}
      </Space>
    </Layout.Content>
  );
}

export default Hub;
