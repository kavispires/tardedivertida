import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Typography, Layout, Space, Card, Image, Divider, Tag } from 'antd';
// Hooks
import { useDimensions, useLanguage } from '../hooks';
// Utils
import gameList from '../resources/games.json';
import { PUBLIC_URL, TAG_DICT } from '../utils/constants';
import { orderBy } from '../utils';
// Components
import { CreateGameModal, RulesModal } from '../components/modals';
import { LanguageSwitch, Translate, translate } from '../components/shared';

function GameCard({ game, language }) {
  const [width] = useDimensions();

  return (
    <Card
      key={game.gameName}
      hoverable
      style={{ width: width && width > 0 ? Math.max(width / 5, 250) : 250 }}
      cover={
        <Image
          alt={game.title[language]}
          src={`${PUBLIC_URL.BANNERS}game-image-${game.gameName}-${language}.jpg`}
          fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve-${language}.jpg`}
        />
      }
    >
      <Card.Meta title={game.title[language]} description={game.summary[language]} />
      <Divider />
      <Card.Meta
        description={translate(
          `Para ${game.min}-${game.max} jogadores`,
          `For ${game.min}-${game.max} players`,
          language
        )}
      />
      <Card.Meta
        description={translate(
          `Recomendado jogar com ${game.recommended}`,
          `Recommended with ${game.recommended}`,
          language
        )}
      />
      <Divider />
      <Space wrap size={[1, 6]}>
        {game.tags.map((tag) => (
          <Tag key={`${game.gameCode}-${tag}`} color={TAG_DICT[tag]?.color}>
            {language === 'pt' ? TAG_DICT[tag]?.label : tag}
          </Tag>
        ))}
      </Space>
      <Divider />
      <Space>
        <RulesModal gameInfo={game} />
        {Boolean(game.available[language]) && <CreateGameModal gameInfo={game} />}
      </Space>
    </Card>
  );
}

GameCard.propTypes = {
  game: PropTypes.shape({
    available: PropTypes.shape({
      pt: PropTypes.bool,
      en: PropTypes.bool,
    }),
    gameCode: PropTypes.string,
    gameName: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    recommended: PropTypes.string,
    summary: PropTypes.shape({
      pt: PropTypes.string,
      en: PropTypes.string,
    }),
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.shape({
      pt: PropTypes.string,
      en: PropTypes.string,
    }),
  }),
};

function Hub() {
  const language = useLanguage();
  const sortedGameList = orderBy(Object.values(gameList), ['available', 'title'], ['desc', 'asc']);

  const { availableGames, comingSoonGames } = sortedGameList.reduce(
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

  return (
    <Layout.Content className="container">
      <Typography.Title>
        Hub <LanguageSwitch />
      </Typography.Title>

      <Typography.Paragraph>
        <Translate pt="Selecione um jogo para começar" en="Select a game to start" />
      </Typography.Paragraph>
      <Space size={[8, 16]} wrap align="start">
        {availableGames.map((game) => (
          <GameCard key={game.code} game={game} language={language} />
        ))}
      </Space>
      <Divider />
      <Typography.Title level={2}>
        <Translate pt="Em Breve" en="Coming Soon" />
      </Typography.Title>
      <Space size={[8, 16]} wrap align="start">
        {comingSoonGames.map((game) => (
          <GameCard key={game.code} game={game} language={language} />
        ))}
      </Space>
    </Layout.Content>
  );
}

export default Hub;
