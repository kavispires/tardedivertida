// Ant Design Resources
import { ClockCircleOutlined } from '@ant-design/icons';
import { Card, Divider, Badge, Space, Tag, Tooltip } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { calculateGameAverageDuration, truncateRecommended } from 'utils/helpers';
// Components
import { GameStrip } from 'components/general/GameBanner';
import { GameTags } from 'components/general/GameTags';
import { RulesModal } from 'components/rules';
// Internal
import { CreateGameFlow } from './CreateGameModal';

const getVersionColor = (version: string) => {
  if (version.includes('dev')) {
    return '#6cb3f6';
  }

  if (version.includes('alpha')) {
    return '#F97659';
  }

  if (version.includes('beta')) {
    return '#F9D859';
  }

  const major = Number(version.split('.')[0]);

  if (Number.isNaN(major)) {
    return '#96A0A3';
  }

  if (major === 0) {
    return '#F9D859';
  }

  if (major === 1) {
    return '#72D984';
  }

  if (major === 2) {
    return '#7CBD51';
  }

  if (major >= 3) {
    return '#7CBD51';
  }

  return '#96A0A3';
};

type GameCardProps = {
  game: GameInfo;
  isAdmin?: boolean;
};

export function GameCard({ game, isAdmin = true }: GameCardProps) {
  const { language, translate } = useLanguage();

  const duration = calculateGameAverageDuration(game);

  return (
    <Card
      key={game.gameName}
      className="game-card"
      cover={
        <Badge.Ribbon
          text={game.version}
          color={getVersionColor(game.version)}
        >
          <div className="game-card__image">
            <GameStrip
              gameName={game.gameName}
              width={256}
              title={game.title}
            />
            <span
              className="game-card__title"
              title={game.title[language]}
            >
              <span className="game-card__title-text">{game.title[language]}</span>{' '}
              <span>
                <Tooltip title={translate('Código do jogo começará com', 'The game id will start with')}>
                  <Tag>{game.gameCode}</Tag>
                </Tooltip>
              </span>
            </span>
          </div>
        </Badge.Ribbon>
      }
    >
      <div className="game-card__contents">
        <Space
          orientation="vertical"
          className="full-width"
        >
          <Card.Meta
            description={`${translate('Inspirado por', 'Inspired by')} ${game.inspiredBy
              .split('')
              .reverse()
              .join('')}`}
          />

          <Card.Meta
            className="game-card__description"
            description={game.summary[language]}
          />

          {Boolean(game.rules?.[language]?.length > 1) && (
            <RulesModal
              gameInfo={game}
              buttonProps={{
                size: 'small',
                className: 'game-card__margin-bottom',
              }}
            />
          )}

          <GameTags
            wrap
            size={[1, 6]}
            style={{ display: 'flex' }}
            gameCode={game.gameCode}
            tags={game.tags}
          />
        </Space>
      </div>

      <div className="game-card__actions">
        {game.duration && (
          <Card.Meta
            description={
              <>
                <ClockCircleOutlined /> {duration.min} min - {duration.max} min (Avg: {duration.ideal} min)
              </>
            }
          />
        )}

        <Divider className="game-card__divider" />

        <Space orientation="vertical">
          <Card.Meta
            description={translate(
              `Para ${game.playerCount.min}-${game.playerCount.max} jogadores`,
              `For ${game.playerCount.min}-${game.playerCount.max} players`,
            )}
          />

          <Card.Meta
            className="game-card__player-count"
            description={translate(
              `Melhor com ${game.playerCount.best || '?'} jogadores`,
              `Best wih ${game.playerCount.best || '?'} players`,
            )}
          />

          <Card.Meta
            className="game-card__player-count game-card__margin-bottom"
            description={translate(
              `Recomendado jogar com ${truncateRecommended(game.playerCount.recommended)}`,
              `Recommended with ${truncateRecommended(game.playerCount.recommended)}`,
            )}
          />
        </Space>

        {isAdmin && (
          <div style={{ marginTop: '1rem' }}>
            {['dev', 'beta', 'stable'].includes(game.release) && <CreateGameFlow gameInfo={game} />}
          </div>
        )}
      </div>
    </Card>
  );
}
