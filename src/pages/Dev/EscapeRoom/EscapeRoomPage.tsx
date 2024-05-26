import './utils/styles.scss';

import { Button, Divider, Form, Input, Select, Space, Tag, Typography } from 'antd';
import { AvatarStrip } from 'components/avatars';
import { DualTranslate, LanguageSwitch, Translate } from 'components/language';
import { useLanguage } from 'hooks/useLanguage';
import { useState } from 'react';
import { GamePlayer } from 'types/player';

import { CardDelegator } from './Components';
import { buildPizzaOrderEpisode } from './data/episode-pizza-order';
import { printEpisode, sliceInParts } from './utils/helpers';
import { EpisodeLevel, EscapeRoomEpisode } from './utils/types';
import { buildTutorialEpisode } from './data/episode-tutorial';

function EscapeRoomPage() {
  const [level, setLevel] = useState<EpisodeLevel>('basic');
  const [playerCount, setPlayerCount] = useState(4);
  const [episodeType, setEpisodeType] = useState<'tutorial' | 'pizza-order'>('tutorial');
  const episodeBuilder = {
    tutorial: buildTutorialEpisode,
    'pizza-order': buildPizzaOrderEpisode,
  }[episodeType];

  const [episode, setEpisode] = useState(episodeBuilder(level, playerCount));

  const players = sliceInParts(episode.cards, playerCount);

  return (
    <div className="escape-room-container">
      <Space wrap className="full-width escape-room-options">
        <Form.Item label={<Translate pt="Episódio" en="Episode" />}>
          <Select style={{ minWidth: '150px' }} onChange={(e) => setEpisodeType(e)} value={episodeType}>
            <Select.Option value="tutorial">Tutorial</Select.Option>
            <Select.Option value="pizza-order">Pizza Order</Select.Option>
            <Select.Option value="art-gallery" disabled>
              Art Gallery
            </Select.Option>
            <Select.Option value="gender-reveal" disabled>
              Gender Reveal Party
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label={<Translate pt="Nível" en="Level" />}>
          <Select style={{ minWidth: '100px' }} onChange={(e) => setLevel(e)} value={level}>
            <Select.Option value="basic">Basic</Select.Option>
            <Select.Option value="intermediate">Intermediate</Select.Option>
            <Select.Option value="advanced">Advanced</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label={<Translate pt="Número de Jogadores" en="Player Count" />}>
          <Select style={{ minWidth: '50px' }} onChange={(e) => setPlayerCount(e)} value={playerCount}>
            <Select.Option value={3}>3</Select.Option>
            <Select.Option value={4}>4</Select.Option>
            <Select.Option value={5}>5</Select.Option>
            <Select.Option value={6}>6</Select.Option>
            <Select.Option value={7}>7</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label={<Translate pt="Idioma" en="Language" />}>
          <LanguageSwitch />
        </Form.Item>

        <Form.Item label={<Translate pt="Novo Episódio" en="New Episode" />}>
          <Button onClick={() => setEpisode(episodeBuilder(level, playerCount))}>
            <Translate pt="Gerar" en="Generate" />
          </Button>
        </Form.Item>
      </Space>

      <Divider />

      <Space wrap className="full-width escape-room-episode" direction="vertical">
        <Typography.Title level={3}>
          <DualTranslate>{episode.title}</DualTranslate>
        </Typography.Title>
        <Typography.Paragraph>
          <Translate pt="Cartas" en="Cards" />: {episode.cards.length}
        </Typography.Paragraph>

        <Space wrap className="full-width" direction="vertical">
          {players.map((player, i) => (
            <PlayerCards key={i} cards={player} index={i} />
          ))}
        </Space>
      </Space>

      <Divider />

      <WinningConditions winningCondition={episode.winningCondition} />

      <Divider />

      <Input.TextArea rows={10} readOnly value={printEpisode(episode)} />
    </div>
  );
}

type PlayerCardsProps = {
  cards: any[];
  index: number;
};

const genericPlayer: GamePlayer = {
  id: '0',
  name: 'Player',
  avatarId: '0',
  updatedAt: 0,
  ready: false,
};

const avatars = [43, 41, 38, 15, 25, 0, 12];
const names = ['Kavis', 'Flaviane', 'Maris', 'Drica', 'Stephanie', 'Rodrigo', 'Marcio'];

function PlayerCards({ cards, index }: PlayerCardsProps) {
  return (
    <Space wrap className="player-cards">
      <AvatarStrip
        player={{ ...genericPlayer, name: names[index], avatarId: String(avatars[index]) }}
        withName
      />
      {cards.map((card, i) => (
        <CardDelegator key={`${card.id}-${i}`} card={card} />
      ))}
    </Space>
  );
}

type WinningConditionsProps = {
  winningCondition: EscapeRoomEpisode['winningCondition'];
};

function WinningConditions({ winningCondition }: WinningConditionsProps) {
  const { dualTranslate } = useLanguage();
  return (
    <Space className="full-width" direction="vertical">
      <Space wrap className="full-width">
        <Typography.Text strong>
          <Translate pt="Inclui" en="Includes" />
        </Typography.Text>
        {winningCondition.includes.map((condition) => (
          <Tag key={condition.keyword} title={dualTranslate(condition.description)}>
            {condition.keyword}
          </Tag>
        ))}
      </Space>
      <Space wrap className="full-width">
        <Typography.Text strong>
          <Translate pt="Inclui Em Ordem" en="Includes In Order" />
        </Typography.Text>
        {winningCondition.ordered.map((condition) => (
          <Tag key={condition.keyword} title={dualTranslate(condition.description)}>
            {condition.keyword}
          </Tag>
        ))}
      </Space>
      <Space wrap className="full-width">
        <Typography.Text strong>
          <Translate pt="Exclui" en="Excludes" />
        </Typography.Text>
        {winningCondition.excludes.map((condition) => (
          <Tag key={condition.keyword} title={dualTranslate(condition.description)}>
            {condition.keyword}
          </Tag>
        ))}
      </Space>
      <Space wrap className="full-width">
        <Typography.Text strong>
          <Translate pt="Bônus" en="Bonus" />
        </Typography.Text>
        {winningCondition.bonuses.map((condition) => (
          <Tag key={condition.keyword} title={dualTranslate(condition.description)}>
            {condition.keyword}
          </Tag>
        ))}
      </Space>
    </Space>
  );
}

export default EscapeRoomPage;
