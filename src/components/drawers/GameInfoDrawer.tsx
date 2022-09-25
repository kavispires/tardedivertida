import { useToggle } from 'react-use';
// Ant Design Resources
import { Button, Divider, Drawer, Image, Space } from 'antd';
import { FireOutlined, SettingOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { SectionMeta } from './_internal/SectionMeta';
import { SectionRankedPlayers } from './_internal/SectionRankedPlayers';
import { SectionSettings } from './_internal/SectionSettings';
import { DebugOnly } from 'components/debug';
import { RulesModal } from 'components/rules';
import { Translate } from 'components/language';
import { PlayersStatusBar } from '../players/PlayersStatusBar';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from 'hooks/useGlobalState';

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
  const [isAdmin] = useGlobalState('isAdmin');

  if (state.phase === 'LOBBY') {
    return <></>;
  }

  return (
    <>
      <PlayersStatusBar players={players} onClick={toggleDrawer} />
      <div className="game-info-drawer">
        <Button size="small" className="game-info-drawer__button" onClick={toggleDrawer}>
          {info.title?.[language] ?? '?'} <SettingOutlined />
          <DebugOnly devOnly>{userId}</DebugOnly>
        </Button>

        <Drawer
          title={info?.title?.[language]}
          placement="right"
          closable={true}
          onClose={toggleDrawer}
          open={isDrawerOpen}
        >
          <Image
            alt={info?.title?.[language]}
            src={`${PUBLIC_URL.BANNERS}${info.gameName}-${language}.jpg`}
            fallback={`${PUBLIC_URL.BANNERS}/em-breve-${language}.jpg`}
            preview={false}
          />

          <Divider />

          <Space>
            <Button type="default" onClick={() => toggleSettingsDrawer(true)} icon={<SettingOutlined />}>
              <Translate pt="Configurações" en="Settings" />
            </Button>{' '}
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
