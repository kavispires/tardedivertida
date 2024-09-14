// Ant Design Resources
import { Card, Image, Space } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PUBLIC_URL } from 'utils/constants';
import { truncateRecommended } from 'utils/helpers';
// Components
import { GameTags } from 'components/general/GameTags';
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
      <Card.Meta style={{ margin: '8px 0' }} description={game.summary[language]} />

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

      <GameTags
        wrap
        size={[1, 6]}
        prefixCls={game.gameName}
        style={{ display: 'flex', marginTop: '12px' }}
        gameCode={game.gameCode}
        tags={game.tags}
      />

      <Space style={{ marginTop: '12px' }}>
        {Boolean(game.rules?.[language]?.length > 1) && <RulesModal gameInfo={game} />}
      </Space>
    </>
  );
}
