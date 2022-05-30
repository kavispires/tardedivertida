import { useState } from 'react';
// Ant Design Resources
import { Button, Divider, Drawer, Image } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// Utils
import { useLanguage } from 'hooks';
// Components
import { SectionMe } from './_internal/SectionMe';
import { SectionMeta } from './_internal/SectionMeta';
import { SectionTeams } from './_internal/SectionTeams';
import { SectionRankedPlayers } from './_internal/SectionRankedPlayers';
import { SectionSettings } from './_internal/SectionSettings';
import { DebugOnly } from 'components/debug';
import { RulesModal } from 'components/rules';
import { PUBLIC_URL } from 'utils/constants';

type GameInfoDrawerProps = {
  players: GamePlayers;
  info: GameInfo;
  state: GameState;
  userId: string;
};

export function GameInfoDrawer({ players, state, info, userId }: GameInfoDrawerProps) {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  if (state.phase === 'LOBBY') {
    return <></>;
  }

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const completeMe = players?.[userId] ?? {};
  const isTeamGame = Boolean(completeMe?.team) && Boolean(state.teams);

  return (
    <>
      <div className="game-info-drawer">
        <Button size="small" className="game-info-drawer__button" onClick={showDrawer}>
          {info.title?.[language] ?? '?'} <InfoCircleOutlined />
          <DebugOnly devOnly>{userId}</DebugOnly>
        </Button>

        <Drawer
          title={info?.title?.[language]}
          placement="right"
          closable={true}
          onClose={onClose}
          visible={visible}
        >
          <Image
            alt={info?.title?.[language]}
            src={`${PUBLIC_URL.BANNERS}game-image-${info.gameName}-${language}.jpg`}
            fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve-${language}.jpg`}
            preview={false}
          />

          <Divider />

          {completeMe && <SectionMe player={completeMe} isTeamGame={isTeamGame} />}

          <Divider />

          <SectionSettings />

          <Divider />

          <RulesModal gameInfo={info} />

          <Divider />

          <SectionMeta
            round={state?.round || 0}
            groupScore={state?.groupScore}
            pointsToVictory={state?.pointsToVictory}
            isTeamGame={isTeamGame}
            teams={state?.teams}
          />

          <Divider />

          {isTeamGame ? (
            <SectionTeams players={players} teams={state?.teams} />
          ) : (
            <SectionRankedPlayers players={players} />
          )}
        </Drawer>
      </div>
    </>
  );
}
