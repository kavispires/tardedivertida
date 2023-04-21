// Ant Design Resources
import { Card, Image, Divider, Badge, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PUBLIC_URL } from 'utils/constants';
import { calculateGameAverageDuration, isDevEnv, truncateRecommended } from 'utils/helpers';
// Components
import { RulesModal } from 'components/rules';
import { CreateGameModal } from './CreateGameModal';
import { GameTags } from 'components/general/GameTags';
import { ClockCircleOutlined } from '@ant-design/icons';

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

  if (isNaN(major)) {
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
        <Badge.Ribbon text={game.version} color={getVersionColor(game.version)}>
          <Image
            alt={game.title[language]}
            src={`${PUBLIC_URL.BANNERS}${game.gameName}-${language}.jpg`}
            fallback={`${PUBLIC_URL.BANNERS}/em-breve-${language}.jpg`}
          />
        </Badge.Ribbon>
      }
    >
      <div className="game-card__contents">
        <Space direction="vertical">
          <Card.Meta
            title={
              <span className="game-card__title" title={game.title[language]}>
                {isDevEnv && `[${game.gameCode}]`} {game.title[language]}
              </span>
            }
            description={`${translate('Baseado em', 'Based on')} ${game.basedOn
              .split('')
              .reverse()
              .join('')}`}
          />

          <Card.Meta className="game-card__description" description={game.summary[language]} />

          {Boolean(game.rules?.[language]?.length > 1) && (
            <RulesModal
              gameInfo={game}
              buttonProps={{ size: 'small', className: 'game-card__margin-bottom' }}
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

        <Space direction="vertical">
          <Card.Meta
            description={translate(
              `Para ${game.playerCount.min}-${game.playerCount.max} jogadores`,
              `For ${game.playerCount.min}-${game.playerCount.max} players`
            )}
          />

          <Card.Meta
            className="game-card__player-count"
            description={translate(
              `Melhor com ${game.playerCount.best || '?'} jogadores`,
              `Best wih ${game.playerCount.best || '?'} players`
            )}
          />

          <Card.Meta
            className="game-card__player-count game-card__margin-bottom"
            description={translate(
              `Recomendado jogar com ${truncateRecommended(game.playerCount.recommended)}`,
              `Recommended with ${truncateRecommended(game.playerCount.recommended)}`
            )}
          />
        </Space>

        {isAdmin && (
          <div style={{ marginTop: '1rem' }}>
            {Boolean(game.available[language]) && <CreateGameModal gameInfo={game} />}
          </div>
        )}
      </div>
    </Card>
  );
}
