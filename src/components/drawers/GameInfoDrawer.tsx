import { useNavigate } from 'react-router-dom';
import { useToggle } from 'react-use';
// Ant Design Resources
import { FireOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar as AntAvatar, Badge, Button, Divider, Drawer, Space } from 'antd';
// Types
import type { GameState } from 'types/game';
import type { GameInfo } from 'types/game-info';
import type { GamePlayers } from 'types/player';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Avatar } from 'components/avatars';
import { DebugOnly } from 'components/debug';
import { GameBanner } from 'components/general/GameBanner';
import { Translate } from 'components/language';
import { PlayersStatusBar } from 'components/players/PlayersStatusBar';
import { RulesModal } from 'components/rules';
// Internal
import { SectionMeta } from './_internal/SectionMeta';
import { SectionRankedPlayers } from './_internal/SectionRankedPlayers';
import { SectionSettings } from './_internal/SectionSettings';

type GameInfoDrawerProps = {
  players: GamePlayers;
  info: GameInfo;
  state: GameState;
  userId: string;
};

export function GameInfoDrawer({ players, state, info, userId }: GameInfoDrawerProps) {
  const { language } = useLanguage();
  const [isDrawerOpen, toggleDrawer] = useToggle(false);
  const [isSettingsOpen, toggleSettingsDrawer] = useToggle(false);
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, isGuest } = useCurrentUserContext();

  if (state.phase === 'LOBBY') {
    return <></>;
  }

  return (
    <>
      <div className="game-info-drawer-container">
        <button className="game-info-drawer-button" onClick={toggleDrawer}>
          <span className="game-info-drawer-button__game-title">
            {info.title?.[language] ?? '?'}
            <DebugOnly devOnly>({players?.[userId]?.name})</DebugOnly>
          </span>
          <AntAvatar icon={<SettingOutlined />} size="small" />
          <div className="game-info-drawer-button__player-status-bar">
            <PlayersStatusBar players={players} />
          </div>
        </button>

        <Drawer
          title={
            <GameBanner
              title={info?.title}
              gameName={info.gameName}
              preview={false}
              className="round-corners"
            />
          }
          placement="right"
          closable={false}
          onClose={toggleDrawer}
          open={isDrawerOpen}
        >
          {isAuthenticated && !isGuest && (
            <p>
              <Badge size="default" dot color="green">
                <Avatar id={players?.[userId]?.avatarId} shape="square" size="small" />
              </Badge>{' '}
              <Translate pt="Você está logado!" en="You are logged in!" />
            </p>
          )}

          <Space>
            <Button type="default" onClick={() => toggleSettingsDrawer(true)} icon={<SettingOutlined />}>
              <Translate pt="Configurações" en="Settings" />
            </Button>
            <RulesModal gameInfo={info} />
            <Drawer
              title={<Translate pt="Configurações" en="Settings" />}
              width={200}
              closable={false}
              onClose={toggleSettingsDrawer}
              open={isSettingsOpen}
            >
              <SectionSettings />
            </Drawer>
            {isAdmin && (
              <Button type="default" danger onClick={() => navigate('/hub')} icon={<FireOutlined />}>
                Hub
              </Button>
            )}
          </Space>

          <Divider />

          <SectionMeta round={state?.round || 0} groupScore={state?.groupScore} />

          <SectionRankedPlayers players={players} />
        </Drawer>
      </div>
    </>
  );
}
