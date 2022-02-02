import { useState } from 'react';
// Design Resources
import { Button, Divider, Drawer } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// Utils
import { useLanguage } from '../../hooks';
import { isDevEnv } from '../../utils/helpers';
// Components
import { RulesModal } from '../modals';
import { SectionMe } from './_internal/SectionMe';
import { SectionMeta } from './_internal/SectionMeta';
import { SectionTeams } from './_internal/SectionTeams';
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
          {isDevEnv && Boolean(userId) && `${userId}`}
        </Button>

        <Drawer
          title={info?.title?.[language]}
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
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
