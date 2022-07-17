// Ant Design Resources
import { Space, Card, Image, Divider, Tag, Badge } from 'antd';
// Hooks
import { useDimensions, useLanguage } from 'hooks';
// Utils
import { PUBLIC_URL, TAG_DICT } from 'utils/constants';
// Components
import { RulesModal } from 'components/rules';
import { CreateGameModal } from './CreateGameModal';
import { MobileFilled } from '@ant-design/icons';
import { Translate } from 'components/language';

const getVersionColor = (version: string) => {
  if (version.endsWith('alpha')) {
    return '#F97659';
  }
  if (version === 'beta') {
    return '#F9D859';
  }

  if (version.startsWith('1.')) {
    return '#72D984';
  }
  if (version.startsWith('2.')) {
    return '#7CBD51';
  }

  if (version.startsWith('3.')) {
    return '#7CBD51';
  }

  return '#96A0A3';
};

type GameCardProps = {
  game: GameInfo;
};

export function GameCard({ game }: GameCardProps) {
  const [width] = useDimensions();
  const { language, translate } = useLanguage();

  return (
    <Badge.Ribbon text={game.version} color={getVersionColor(game.version)}>
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
        <Card.Meta
          title={game.title[language]}
          description={`${translate('Baseado em', 'Based on')} ${game.basedOn.split('').reverse().join('')}`}
        />
        <Card.Meta style={{ marginTop: '24px' }} description={game.summary[language]} />

        <Divider />

        <Card.Meta
          description={translate(
            `Para ${game.playerCount.min}-${game.playerCount.max} jogadores`,
            `For ${game.playerCount.min}-${game.playerCount.max} players`
          )}
        />
        <Card.Meta
          description={translate(
            `Recomendado jogar com ${game.playerCount.recommended}`,
            `Recommended with ${game.playerCount.recommended}`
          )}
        />

        {game.mobileFriendly && (
          <Card.Meta
            description={
              <>
                <MobileFilled /> <Translate pt="Funciona em aparelhos móveis" en="Mobile friendly" />
              </>
            }
          />
        )}

        <Divider />

        <Space wrap size={[1, 6]} prefixCls={game.gameName} style={{ display: 'flex' }}>
          {game.tags.map((tag) => (
            <Tag key={`${game.gameCode}-${tag}`} color={TAG_DICT[tag]?.color}>
              {language === 'pt' ? TAG_DICT[tag]?.label : tag}
            </Tag>
          ))}
        </Space>

        <Divider />

        <Space>
          {Boolean(game.rules?.[language]?.length > 1) && <RulesModal gameInfo={game} />}
          {Boolean(game.available[language]) && <CreateGameModal gameInfo={game} />}
        </Space>
      </Card>
    </Badge.Ribbon>
  );
}
