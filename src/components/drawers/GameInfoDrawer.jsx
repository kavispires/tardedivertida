import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
// Design Resources
import { Affix, Button, Divider, Drawer } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { RulesModal } from '../modals';
import { SectionMe } from './_internal/SectionMe';
import { SectionMeta } from './_internal/SectionMeta';
import { SectionTeams } from './_internal/SectionTeams';
import { SectionRankedPlayers } from './_internal/SectionRankedPlayers';
import { SectionSettings } from './_internal/SectionSettings';
import { isDevEnv } from '../../utils';

export function GameInfoDrawer({ players, state, info, userId }) {
  const language = useLanguage();
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
    <Fragment>
      <Affix offsetTop={0}>
        <Button size="small" className="game-info-drawer__button" onClick={showDrawer}>
          {info.title[language]} <InfoCircleOutlined />
          {isDevEnv && Boolean(userId) && `${userId}`}
        </Button>
      </Affix>

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
          roundsToEndGame={state?.roundsToEndGame}
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
    </Fragment>
  );
}

GameInfoDrawer.propTypes = {
  info: PropTypes.shape({
    title: PropTypes.shape({
      pt: PropTypes.string,
      en: PropTypes.string,
    }),
  }),
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatarId: PropTypes.string,
    })
  ),
  state: PropTypes.shape({
    groupScore: PropTypes.number,
    phase: PropTypes.string,
    pointsToVictory: PropTypes.number,
    round: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ current: PropTypes.number, total: PropTypes.number }),
    ]),
    roundsToEndGame: PropTypes.number,
    teams: PropTypes.objectOf(
      PropTypes.shape({
        members: PropTypes.arrayOf(PropTypes.string),
        name: PropTypes.string,
      })
    ),
  }),
  userId: PropTypes.string,
};
