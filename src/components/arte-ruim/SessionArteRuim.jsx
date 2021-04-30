import React from 'react';
// Design Resources
import { Layout } from 'antd';
// Hooks
// import { useGameInfo, useGameState } from '../../hooks';
import { GAME_COLLECTION } from '../../utils/constants';

function SessionArteRuim({ gameId }) {
  // const info = useGameInfo(gameId, GAME_COLLECTION.ARTE_RUIM);
  // const state = useGameState(gameId, GAME_COLLECTION.ARTE_RUIM);

  return (
    <Layout.Content className="game game--arte-ruim">
      <h1>Hi</h1>
    </Layout.Content>
  );
}

export default SessionArteRuim;
