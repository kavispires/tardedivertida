import { useNavigate } from 'react-router-dom';
import { useToggle } from 'react-use';
// Ant Design Resources
import { FireOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Drawer, Flex, Space, Tag, Tooltip, Typography } from 'antd';
// Types
import type { GameState, GamePlayers } from 'types/game';
// Hooks
import { useCurrentUserContext } from '@hooks/useCurrentUserContext';
import { useLanguage } from '@hooks/useLanguage';
// Components
import { DebugOnly } from '@components/debug/DebugOnly';
import { GameStrip } from '@components/game-identity/GameBanner';
import { Translate } from '@components/language/Translate';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { PlayersStatusBar } from '@components/players/PlayersStatusBar';
import { RulesModal } from '@components/rules/RulesModal';
import { useGameInfoContext } from '@components/session/GameInfoContext';
// Internal
import { SectionMeta } from './SectionMeta';
import { SectionRankedPlayers } from './SectionRankedPlayers';
import { SectionSettings } from './SectionSettings';
// Sass
import styles from './drawers.module.scss';

type GameInfoDrawerProps = {
  /**
   * The game players object
   */
  players: GamePlayers;
  /**
   * The current game state
   */
  state: GameState;
  /**
   * The current user's ID
   */
  userId: string;
};

/**
 * Drawer component that displays game information, player rankings, and settings
 */
export function GameInfoDrawer({ players, state, userId }: GameInfoDrawerProps) {
  const info = useGameInfoContext();
  const { language } = useLanguage();
  const [isDrawerOpen, toggleDrawer] = useToggle(false);
  const [isSettingsOpen, toggleSettingsDrawer] = useToggle(false);
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, isGuest } = useCurrentUserContext();

  if (state.phase === 'LOBBY') {
    return null;
  }

  return (
    <div className={styles.gameInfoDrawerContainer}>
      <button
        type="button"
        className={styles.gameInfoDrawerButton}
        onClick={toggleDrawer}
      >
        <span className={styles.gameInfoDrawerButton__gameTitle}>
          <Tooltip
            title={
              <Translate
                pt="Você está jogando este jogo. Clique para mais informações."
                en="You are playing this game. Click for more info."
              />
            }
          >
            {info.title?.[language] ?? '?'}
          </Tooltip>
          <DebugOnly devOnly>
            {' '}
            <Tag>
              {players?.[userId]?.name} ({userId.slice(0, 3)})
            </Tag>
          </DebugOnly>
        </span>
        <Avatar
          icon={<SettingOutlined />}
          size="small"
        />
        <div className={styles.gameInfoDrawerButton__playerStatusBar}>
          <PlayersStatusBar players={players} />
        </div>
      </button>

      <Drawer
        title={
          <Flex vertical>
            <GameStrip
              title={info?.title}
              gameName={info.gameName}
              className="round-corners mb-0"
              width={256}
              static
            />
            <Typography.Text type="secondary">
              Inspired by: {info.inspiredBy.split('').reverse().join('')}
            </Typography.Text>
          </Flex>
        }
        placement="right"
        closable={false}
        onClose={toggleDrawer}
        open={isDrawerOpen}
      >
        {isAuthenticated && !isGuest && (
          <p>
            <Badge
              size="medium"
              dot
              color="green"
            >
              <PlayerAvatar
                avatarId={players?.[userId]?.avatarId}
                shape="square"
                size="small"
              />
            </Badge>{' '}
            <Translate
              pt="Você está logado!"
              en="You are logged in!"
            />
          </p>
        )}

        <Space>
          <Button
            type="default"
            onClick={() => toggleSettingsDrawer(true)}
            icon={<SettingOutlined />}
          >
            <Translate
              pt="Configurações"
              en="Settings"
            />
          </Button>
          <RulesModal gameInfo={info} />
          <Drawer
            title={
              <Translate
                pt="Configurações"
                en="Settings"
              />
            }
            size={200}
            closable={false}
            onClose={toggleSettingsDrawer}
            open={isSettingsOpen}
          >
            <SectionSettings />
          </Drawer>
          {isAdmin && (
            <Button
              type="default"
              danger
              onClick={() => navigate('/hub')}
              icon={<FireOutlined />}
            >
              Hub
            </Button>
          )}
        </Space>

        <Divider />

        <SectionMeta
          round={state?.round || 0}
          groupScore={state?.groupScore}
        />

        <SectionRankedPlayers players={players} />
      </Drawer>
    </div>
  );
}
