import clsx from 'clsx';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Badge, Col, Modal, Row } from 'antd';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { GameBanner } from 'components/general/GameBanner';
import { DualTranslate, Translate } from 'components/language';
import { GameCard } from 'pages/Hub/components/GameCard';

type GameUserStatisticsProps = {
  info: GameInfo[];
  games: Record<string, GameUserStatistics>;
};

export function GameCheckCard({ info, games }: GameUserStatisticsProps) {
  const [open, setOpen] = useState(false);
  const [activeGameName, setActiveGame] = useState<GameName>('arte-ruim');

  const activeGame: GameInfo = useMemo(() => {
    return info.find((g) => g.gameName === activeGameName) ?? info[0];
  }, [activeGameName, info]);

  const activateGameCard = (gameName: GameName) => {
    setOpen(true);
    setActiveGame(gameName);
  };

  const modal = (
    <Modal
      open={open}
      title={<DualTranslate>{activeGame.title}</DualTranslate>}
      cancelText={<Translate pt="Fechar" en="Close" />}
      onCancel={() => setOpen(false)}
      okButtonProps={{
        style: { display: 'none' },
      }}
    >
      <GameCard game={activeGame} isAdmin={false} />
    </Modal>
  );

  return (
    <Row gutter={8}>
      {modal}
      {info.map((gameInfo) => (
        <Col xs={12} sm={6} md={6} lg={3} key={`info-${gameInfo.gameName}`}>
          <TransparentButton onClick={() => activateGameCard(gameInfo.gameName)}>
            {Boolean(games[gameInfo.gameName]) ? (
              <Badge count={<IconAvatar icon={<SpeechBubbleAcceptedIcon />} size="small" />}>
                <GameBanner
                  title={gameInfo.title}
                  gameName={gameInfo.gameName}
                  className={clsx('me__game-bingo-banner', 'me__game-bingo-banner--played')}
                  preview={false}
                />
              </Badge>
            ) : (
              <GameBanner
                title={gameInfo.title}
                gameName={gameInfo.gameName}
                className={clsx('me__game-bingo-banner')}
                preview={false}
              />
            )}
          </TransparentButton>
        </Col>
      ))}
    </Row>
  );
}
