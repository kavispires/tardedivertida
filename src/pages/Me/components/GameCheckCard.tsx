import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { useWindowSize } from 'react-use';
// Ant Design Resources
import { Badge, Col, Flex, Modal, Row, Select, Switch } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
import type { GameUserStatistics } from 'types/user';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useQueryParams } from 'hooks/useQueryParams';
// Utils
import ACHIEVEMENTS_DICT from 'utils/achievements';
// Icons
import { AnimatedVideoConferenceIcon } from 'icons/AnimatedVideoConferenceIcon';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { TransparentButton } from 'components/buttons/TransparentButton';
import { GameBanner } from 'components/general/GameBanner';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
// Internal
import { GameStatistics } from './GameStatistics';

type GameUserStatisticsProps = {
  info: GameInfo[];
  games: Record<string, GameUserStatistics>;
};

export function GameCheckCard({ info, games }: GameUserStatisticsProps) {
  const { width } = useWindowSize();
  const cardWidth = useCardWidth(8, { maxWidth: 256, minWidth: 128 });
  const [order, setOrder] = useState('gameName');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const { language } = useLanguage();

  const { queryParams, addParam, removeParam } = useQueryParams();
  const activeGameId = queryParams.get('game');

  const orderedInfo = useMemo(() => {
    return orderBy(
      info,
      [
        (game) => {
          if (order === 'releaseDate') {
            return new Date(game.releaseDate || '1970-01-01').getTime();
          }
          return game.title[language];
        },
      ],
      [orderDirection],
    );
  }, [info, order, orderDirection, language]);

  const activeGame: GameInfo | null = useMemo(() => {
    return info.find((g) => g.gameName === activeGameId) ?? null;
  }, [activeGameId, info]);

  const modal = (
    <Modal
      open={!!activeGameId}
      title={<DualTranslate>{activeGame ? activeGame.title : { pt: '?', en: '?' }}</DualTranslate>}
      cancelText={
        <Translate
          pt="Fechar"
          en="Close"
        />
      }
      onCancel={() => removeParam('game')}
      okButtonProps={{
        hidden: true,
      }}
      centered
      className="me-modal"
      width={width}
    >
      {activeGame && activeGameId ? (
        <GameStatistics
          game={games[activeGameId]}
          info={activeGame}
          achievements={ACHIEVEMENTS_DICT?.[activeGameId] ?? {}}
        />
      ) : (
        <div className="me-modal__content">
          <IconAvatar
            icon={<AnimatedVideoConferenceIcon />}
            size={100}
          />
        </div>
      )}
    </Modal>
  );

  return (
    <Flex
      vertical
      gap={8}
    >
      <Flex
        align="center"
        gap={8}
      >
        <span>
          <Translate
            pt="Ordenar por:"
            en="Sort by:"
          />
        </span>
        <Select
          options={[
            {
              value: 'gameName',
              label: (
                <Translate
                  pt="Alfabética"
                  en="Alphabetical"
                />
              ),
            },
            {
              value: 'releaseDate',
              label: (
                <Translate
                  pt="Data de Lançamento"
                  en="Release Date"
                />
              ),
            },
          ]}
          value={order}
          onChange={(value) => setOrder(value)}
          defaultValue="gameName"
          style={{ width: 175 }}
        />
        <Switch
          checked={orderDirection === 'asc'}
          onChange={(checked) => setOrderDirection(checked ? 'asc' : 'desc')}
          checkedChildren="A-Z"
          unCheckedChildren="Z-A"
        />
      </Flex>
      <Row gutter={8}>
        {modal}
        {orderedInfo.map((gameInfo) => (
          <Col
            xs={12}
            sm={6}
            md={6}
            lg={3}
            key={`info-${gameInfo.gameName}`}
          >
            <TransparentButton onClick={() => addParam('game', gameInfo.gameName)}>
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
                  className={clsx('me__game-bingo-banner', {
                    'me__game-bingo-banner--played': games[gameInfo.gameName],
                    'me__game-bingo-banner--beta': gameInfo.release === 'beta',
                  })}
                  static
                  width={cardWidth}
                />
              </Badge>
            </TransparentButton>
          </Col>
        ))}
      </Row>
    </Flex>
  );
}
