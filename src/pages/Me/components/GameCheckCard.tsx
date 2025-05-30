import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useWindowSize } from 'react-use';
// Ant Design Resources
import { Badge, Col, Modal, Row } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
import type { GameUserStatistics } from 'types/user';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useQueryParams } from 'hooks/useQueryParams';
// Utils
import ACHIEVEMENTS_DICT from 'utils/achievements';
// Icons
import { AnimatedVideoConferenceIcon } from 'icons/AnimatedVideoConferenceIcon';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { GameBanner } from 'components/general/GameBanner';
import { DualTranslate, Translate } from 'components/language';
// Internal
import { GameStatistics } from './GameStatistics';

type GameUserStatisticsProps = {
  info: GameInfo[];
  games: Record<string, GameUserStatistics>;
};

export function GameCheckCard({ info, games }: GameUserStatisticsProps) {
  const [open, setOpen] = useState(false);
  const [activeGameName, setActiveGame] = useState<GameName | null>(null);
  const { width } = useWindowSize();
  const cardWidth = useCardWidth(8, { maxWidth: 256, minWidth: 128 });

  const qp = useQueryParams();

  const activeGame: GameInfo | null = useMemo(() => {
    return info.find((g) => g.gameName === activeGameName) ?? null;
  }, [activeGameName, info]);

  const activateGameCard = (gameName: GameName) => {
    setOpen(true);
    setActiveGame(gameName);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: the functions are not important
  useEffect(() => {
    if (qp.queryParams.game && qp.queryParams.game !== activeGameName) {
      activateGameCard(qp.queryParams.game);
    }
    if (!qp.queryParams.game) {
      setOpen(false);
      setActiveGame('');
    }
  }, [qp.queryParams.game]);

  const modal = (
    <Modal
      open={open}
      title={<DualTranslate>{activeGame ? activeGame.title : { pt: '?', en: '?' }}</DualTranslate>}
      cancelText={<Translate pt="Fechar" en="Close" />}
      onCancel={() => qp.remove('game')}
      okButtonProps={{
        hidden: true,
      }}
      centered
      className="me-modal"
      width={width}
    >
      {activeGame && activeGameName ? (
        <GameStatistics
          game={games[activeGameName]}
          info={activeGame}
          achievements={ACHIEVEMENTS_DICT?.[activeGameName]}
        />
      ) : (
        <div className="me-modal__content">
          <IconAvatar icon={<AnimatedVideoConferenceIcon />} size={100} />
        </div>
      )}
    </Modal>
  );

  return (
    <Row gutter={8}>
      {modal}
      {info.map((gameInfo) => (
        <Col xs={12} sm={6} md={6} lg={3} key={`info-${gameInfo.gameName}`}>
          <TransparentButton onClick={() => qp.add('game', gameInfo.gameName)}>
            <Badge
              count={
                games[gameInfo.gameName] ? <IconAvatar icon={<SpeechBubbleAcceptedIcon />} /> : undefined
              }
              size="small"
              classNames={{
                indicator: 'me__game-bingo-badge',
              }}
            >
              <GameBanner
                title={gameInfo.title}
                gameName={gameInfo.gameName}
                className={clsx('me__game-bingo-banner', 'me__game-bingo-banner--played')}
                static
                width={cardWidth}
              />
            </Badge>
          </TransparentButton>
        </Col>
      ))}
    </Row>
  );
}
