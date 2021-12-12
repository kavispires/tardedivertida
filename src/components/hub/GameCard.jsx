import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Space, Card, Image, Divider, Tag } from 'antd';
// Hooks
import { useDimensions } from '../../hooks';
// Utils
import { PUBLIC_URL, TAG_DICT } from '../../utils/constants';
// Components
import { CreateGameModal, RulesModal } from '../modals';
import { translate } from '../shared';

export function GameCard({ game, language }) {
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
      en: PropTypes.bool,
      pt: PropTypes.bool,
    }),
    gameCode: PropTypes.string,
    gameName: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    recommended: PropTypes.string,
    summary: PropTypes.shape({
      en: PropTypes.string,
      pt: PropTypes.string,
    }),
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.shape({
      en: PropTypes.string,
      pt: PropTypes.string,
    }),
  }),
  language: PropTypes.string,
};
