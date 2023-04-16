import { useToggle } from 'react-use';
import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { Badge, Button, Divider, Drawer, Space } from 'antd';
import { FireOutlined, SettingOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Components
import { SectionMeta } from './_internal/SectionMeta';
import { SectionRankedPlayers } from './_internal/SectionRankedPlayers';
import { SectionSettings } from './_internal/SectionSettings';
import { DebugOnly } from 'components/debug';
import { RulesModal } from 'components/rules';
import { Translate } from 'components/language';
import { PlayersStatusBar } from 'components/players/PlayersStatusBar';
import { GameBanner } from 'components/general/GameBanner';
import { Avatar } from 'components/avatars';

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
  const { isAdmin, isAuthenticated, isAnonymous } = useCurrentUserContext();

  if (state.phase === 'LOBBY') {
    return <></>;
  }

  return (
    <>
      <PlayersStatusBar players={players} onClick={toggleDrawer} />
      <div className="game-info-drawer">
        <Button size="small" className="game-info-drawer__button" onClick={toggleDrawer}>
          {info.title?.[language] ?? '?'} <SettingOutlined />
          <DebugOnly devOnly>{players?.[userId]?.name}</DebugOnly>
        </Button>

        <Drawer
          title={info?.title?.[language]}
          placement="right"
          closable={true}
          onClose={toggleDrawer}
          open={isDrawerOpen}
        >
          <GameBanner
            title={info?.title}
            gameName={info.gameName}
            preview={false}
            className="round-corners"
          />

          <Divider />

          {isAuthenticated && !isAnonymous && (
            <p>
              <Badge size="default" dot color="green">
                <Avatar id={players[userId].avatarId} shape="square" size="small" />
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

          <Divider />

          <SectionRankedPlayers players={players} />
        </Drawer>
      </div>
    </>
  );
}
