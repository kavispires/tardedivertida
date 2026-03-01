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
  info: GameInfo;
  isAdmin?: boolean;
};

export function GameCard({ info, isAdmin = true }: GameCardProps) {
  const { language, translate } = useLanguage();

  const duration = calculateGameAverageDuration(info);

  return (
    <Card
      key={info.gameName}
      className="game-card"
      cover={
        <Badge.Ribbon
          text={info.version}
          color={getVersionColor(info.version)}
        >
          <div className="game-card__image">
            <GameStrip
              gameName={info.gameName}
              width={256}
              title={info.title}
            />
            <span
              className="game-card__title"
              title={info.title[language]}
            >
              <span className="game-card__title-text">{info.title[language]}</span>{' '}
              <span>
                <Tooltip title={translate('Código do jogo começará com', 'The game id will start with')}>
                  <Tag>{info.gameCode}</Tag>
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
            description={`${translate('Inspirado por', 'Inspired by')} ${info.inspiredBy
              .split('')
              .reverse()
              .join('')}`}
          />

          <Card.Meta
            className="game-card__description"
            description={info.summary[language]}
          />

          {Boolean(info.rules?.[language]?.length > 1) && (
            <RulesModal
              gameInfo={info}
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
            gameCode={info.gameCode}
            mechanics={info.mechanics}
            features={info.features}
          />
        </Space>
      </div>

      <div className="game-card__actions">
        {info.duration && (
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
              `Para ${info.playerCount.min}-${info.playerCount.max} jogadores`,
              `For ${info.playerCount.min}-${info.playerCount.max} players`,
            )}
          />

          <Card.Meta
            className="game-card__player-count"
            description={translate(
              `Melhor com ${info.playerCount.best || '?'} jogadores`,
              `Best wih ${info.playerCount.best || '?'} players`,
            )}
          />

          <Card.Meta
            className="game-card__player-count game-card__margin-bottom"
            description={translate(
              `Recomendado jogar com ${truncateRecommended(info.playerCount.recommended)}`,
              `Recommended with ${truncateRecommended(info.playerCount.recommended)}`,
            )}
          />
        </Space>

        {isAdmin && (
          <div style={{ marginTop: '1rem' }}>
            {['dev', 'beta', 'stable'].includes(info.release) && <CreateGameFlow gameInfo={info} />}
          </div>
        )}
      </div>
    </Card>
  );
}
