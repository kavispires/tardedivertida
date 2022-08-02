// Ant Design Resources
import { Card, Divider, Image, Space, Tag } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Utils
import { PUBLIC_URL, TAG_DICT } from 'utils/constants';
// Components
import { RulesModal } from 'components/rules';

export function GameDetailsContent({ game }: { game: GameInfo }) {
  const { language, translate } = useLanguage();
  return (
    <>
      <Image
        alt={game.title[language]}
        src={`${PUBLIC_URL.EXAMPLES}game-example-${game.gameName}.png`}
        fallback={`${PUBLIC_URL.BANNERS}/em-breve-${language}.jpg`}
      />
      <Card.Meta style={{ marginTop: '8px' }} description={game.summary[language]} />

      <Card.Meta
        style={{ marginTop: '8px' }}
        description={translate(
          `Para ${game.playerCount.min}-${game.playerCount.max} jogadores`,
          `For ${game.playerCount.min}-${game.playerCount.max} players`
        )}
      />

      <Divider />

      <Card.Meta
        description={translate(
          `Recomendado jogar com ${game.playerCount.recommended}`,
          `Recommended with ${game.playerCount.recommended}`
        )}
      />

      <Space wrap size={[1, 6]} prefixCls={game.gameName} style={{ display: 'flex', marginTop: '12px' }}>
        {game.tags.map((tag) => (
          <Tag key={`${game.gameCode}-${tag}`} color={TAG_DICT[tag]?.color}>
            {language === 'pt' ? TAG_DICT[tag]?.label : tag}
          </Tag>
        ))}
      </Space>

      <Space style={{ marginTop: '12px' }}>
        {Boolean(game.rules?.[language]?.length > 1) && <RulesModal gameInfo={game} />}
      </Space>
    </>
  );
}
